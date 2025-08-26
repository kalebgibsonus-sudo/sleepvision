import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

const MORNING_ROUTINE_PROMPT = `You are Luna, a friendly and expert morning routine coach AI who helps users create personalized, energizing morning routines. Based on the user's questionnaire responses, create a detailed, practical, and personalized morning routine with specific timed activities.

When creating a morning routine, provide a JSON response with this exact structure:
{
  "summary": "Brief analysis of their morning goals and how this routine addresses their needs",
  "routine": [
    {
      "time": "6:30 AM",
      "activity": "Morning hydration",
      "description": "Drink 16-20oz of room temperature water to rehydrate after sleep",
      "category": "wellness"
    }
  ],
  "recommendations": {
    "tips": ["Evidence-based morning routine tip", "Habit formation advice", "Personalized recommendation"]
  }
}

Routine Categories:
- "preparation": Getting ready activities and essential morning tasks
- "wellness": Health, fitness, mindfulness, and self-care activities
- "productivity": Planning, organizing, and mental preparation for the day
- "energy": Activities that boost energy, alertness, and motivation

CRITICAL Guidelines for morning routine creation:
- Create a routine with 6-12 specific timed activities based on their available time
- Start from their specified wake-up time and work forward
- Use exact times in 12-hour format (e.g., "6:30 AM", "7:15 AM")
- Ensure chronological order and realistic time gaps between activities
- Tailor activities to their energy level, goals, and time constraints
- Address their specific challenges and motivation style
- Include activities that align with their stated morning goal
- Make the routine feel achievable and sustainable
- Consider their work schedule and commute time
- Incorporate their exercise and caffeine preferences

Activity Types to Include Based on Preferences:
- Hydration and nutrition optimization
- Movement and exercise (based on their preference level)
- Mindfulness, meditation, or breathing exercises
- Planning, goal-setting, and day preparation
- Personal hygiene and getting ready
- Energy-boosting activities
- Learning or personal development
- Environmental optimization (light, music, etc.)

Always create a routine that feels personalized to their specific responses, not generic morning advice.`;

function generateFallbackMorningRoutine(data: any) {
  const wakeTime = data.desiredWakeUpTime || data.currentWakeUpTime || "7:00";
  const [hours, minutes] = wakeTime.split(":").map(Number);

  const addMinutes = (
    baseHours: number,
    baseMinutes: number,
    minutesToAdd: number,
  ) => {
    const totalMinutes = baseHours * 60 + baseMinutes + minutesToAdd;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    return `${newHours}:${newMinutes.toString().padStart(2, "0")} AM`;
  };

  return [
    {
      time: `${hours}:${minutes.toString().padStart(2, "0")} AM`,
      activity: "Gentle awakening",
      description:
        "Wake up naturally and set a positive intention for your day",
      category: "preparation",
    },
    {
      time: addMinutes(hours, minutes, 5),
      activity: "Morning hydration",
      description:
        "Drink 16-20oz of room temperature water to rehydrate your body",
      category: "wellness",
    },
    {
      time: addMinutes(hours, minutes, 15),
      activity: "Energizing movement",
      description: "Light stretching or gentle exercise to activate your body",
      category: "wellness",
    },
    {
      time: addMinutes(hours, minutes, 30),
      activity: "Mindful preparation",
      description: "Complete your morning routine with intention and focus",
      category: "preparation",
    },
  ];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const questionnaireData = req.body;

    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key not found in environment variables");
      return res.status(500).json({
        success: false,
        error: "OpenAI API key not configured",
      });
    }

    if (!questionnaireData) {
      return res.status(400).json({
        success: false,
        error: "Questionnaire data is required",
      });
    }

    const contextMessage = `Please create a personalized morning routine based on the following user information:

Current Wake-up Time: ${questionnaireData.currentWakeUpTime}
DESIRED Wake-up Time: ${questionnaireData.desiredWakeUpTime} (USE THIS FOR THE ROUTINE)
Morning Goal: ${questionnaireData.morningGoal}
Available Time: ${questionnaireData.availableTime}
Energy Level: ${questionnaireData.morningEnergyLevel}
Motivation Style: ${questionnaireData.motivationStyle}
Ideal Mood: ${questionnaireData.morningMood}
Current Activities: ${questionnaireData.currentMorningActivities?.join(", ") || "None specified"}
Exercise Preference: ${questionnaireData.exercisePreference}
Caffeine Habits: ${questionnaireData.caffeineHabits}
Work Start Time: ${questionnaireData.workStartTime}
Commute Time: ${questionnaireData.morningCommute}
Weekend Routine: ${questionnaireData.weekendDifference}
Morning Challenges: ${questionnaireData.morningChallenges?.join(", ") || "None specified"}
Productivity Goals: ${questionnaireData.productivityGoals?.join(", ") || "None specified"}
Wellness Goals: ${questionnaireData.wellnessGoals?.join(", ") || "None specified"}
Environment Preference: ${questionnaireData.morningEnvironment}
Seasonal Preferences: ${questionnaireData.seasonalPreferences}
Additional Information: ${questionnaireData.additionalInfo}

Please create a detailed, personalized morning routine that addresses their specific needs, goals, and constraints.`;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: MORNING_ROUTINE_PROMPT,
        },
        {
          role: "user",
          content: contextMessage,
        },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return res.status(500).json({
        success: false,
        error: "No response from OpenAI",
      });
    }

    try {
      const routineData = JSON.parse(aiResponse);

      if (!routineData.routine || !Array.isArray(routineData.routine)) {
        throw new Error("Invalid routine format from AI");
      }

      res.json({
        success: true,
        data: routineData,
      });
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.error("Raw AI response:", aiResponse);

      res.json({
        success: true,
        data: {
          summary: "Luna has created your personalized morning routine",
          routine: generateFallbackMorningRoutine(questionnaireData),
          fallbackUsed: true,
        },
      });
    }
  } catch (error) {
    console.error("Morning routine generation error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

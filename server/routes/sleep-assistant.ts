import { RequestHandler } from "express";
import OpenAI from "openai";
import { SleepAssistantRequest, SleepAssistantResponse } from "@shared/api";

// Initialize OpenAI client (only in runtime, not during build)
const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

const LUNA_PROMPT = `You are Luna, a friendly and expert sleep coach AI who helps users improve their sleep quality and morning routines. Based on the user's questionnaire responses, create a detailed, practical, and personalized sleep schedule with specific hourly activities formatted as a complete daily schedule list.

When creating a schedule, provide a JSON response with this exact structure:
{
  "summary": "Brief analysis of their sleep situation and how this schedule addresses their needs",
  "schedule": [
    {
      "time": "6:00 PM",
      "activity": "Finish daily work",
      "description": "Complete work tasks and mentally transition away from work mode",
      "category": "evening"
    },
    {
      "time": "7:00 PM",
      "activity": "Light dinner",
      "description": "Eat a balanced, light dinner avoiding heavy or spicy foods",
      "category": "evening"
    }
  ],
  "recommendations": {
    "tips": ["Evidence-based tip for better sleep", "Practical habit formation advice", "Personalized recommendation based on their issues"]
  }
}

Schedule Categories:
- "evening": Activities from 6 PM to bedtime (wind-down preparation)
- "night": Sleep preparation and bedtime routine (1-2 hours before sleep)
- "morning": Wake-up routine and morning activities (first 2-3 hours after waking)

CRITICAL Guidelines for schedule creation:
- Create a COMPLETE daily schedule with 10-15 specific timed activities
- Start from evening (6:00 PM or earlier) and go through to morning (8:00-9:00 AM)
- Use exact times in 12-hour format (e.g., "6:30 PM", "10:15 PM", "6:45 AM")
- Ensure chronological order and realistic time gaps between activities
- Include transitional activities between major schedule segments
- Address their specific sleep issues with targeted activities
- Make the schedule feel like a complete, followable daily routine
- Include specific, actionable descriptions for each time slot
- Consider their work schedule, lifestyle, and personal challenges
- Incorporate evidence-based sleep hygiene and circadian rhythm optimization

Activity Types to Include:
- Work/life transition activities
- Dinner and nutrition timing
- Exercise/movement (based on their habits)
- Digital device management
- Relaxation and stress reduction
- Personal hygiene and preparation
- Environmental optimization
- Sleep preparation rituals
- Wake-up and activation routines
- Morning productivity setup

Always create a comprehensive schedule that feels like a complete lifestyle transformation, not just basic sleep hygiene tips.`;

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

export const handleScheduleGeneration: RequestHandler = async (req, res) => {
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

    // Build detailed context from questionnaire data
    const contextMessage = `Please create a personalized sleep schedule based on the following user information:

Age: ${questionnaireData.age}
Sleep Goal: ${questionnaireData.sleepGoal} hours
Current Bedtime: ${questionnaireData.currentBedtime}
Current Wake Time: ${questionnaireData.currentWakeTime}
DESIRED Bedtime: ${questionnaireData.desiredBedtime} (USE THIS FOR THE SCHEDULE)
DESIRED Wake Time: ${questionnaireData.desiredWakeTime} (USE THIS FOR THE SCHEDULE)
Sleep Quality: ${questionnaireData.sleepQuality}
Sleep Issues: ${questionnaireData.sleepIssues.join(", ")}
Lifestyle: ${questionnaireData.lifestyle}
Work Schedule: ${questionnaireData.workSchedule}
Caffeine Consumption: ${questionnaireData.caffeine}
Screen Time Before Bed: ${questionnaireData.screenTime}
Sleep Environment: ${questionnaireData.environment}
Stress Level: ${questionnaireData.stressLevel}
Exercise Habits: ${questionnaireData.exerciseHabits}
Additional Information: ${questionnaireData.additionalInfo}

Please create a detailed hourly schedule that addresses their specific needs and challenges.`;

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: LUNA_PROMPT,
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
      // Try to parse JSON response
      const scheduleData = JSON.parse(aiResponse);

      // Validate that the response has the expected structure
      if (!scheduleData.schedule || !Array.isArray(scheduleData.schedule)) {
        throw new Error("Invalid schedule format from AI");
      }

      res.json({
        success: true,
        data: scheduleData,
      });
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.error("Raw AI response:", aiResponse);

      // If JSON parsing fails, return the fallback schedule
      res.json({
        success: true,
        data: {
          summary: "Luna has created your personalized schedule",
          schedule: generateFallbackSchedule(questionnaireData),
          fallbackUsed: true,
        },
      });
    }
  } catch (error) {
    console.error("Schedule generation error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Fallback schedule generation if AI response isn't in expected format
function generateFallbackSchedule(data: any) {
  // Use desired times if available, fallback to current times
  const desiredBedtime = data.desiredBedtime || data.currentBedtime || "22:00";
  const desiredWakeTime =
    data.desiredWakeTime || data.currentWakeTime || "6:00";

  const bedtimeHour = parseInt(desiredBedtime.split(":")[0]);
  const wakeHour = parseInt(desiredWakeTime.split(":")[0]);

  return [
    {
      time: `${bedtimeHour - 2}:00 PM`,
      activity: "Begin evening routine",
      description: "Start winding down from daily activities",
      category: "evening",
    },
    {
      time: `${bedtimeHour - 1}:30 PM`,
      activity: "Digital sunset",
      description: "Turn off screens and electronic devices",
      category: "evening",
    },
    {
      time: `${bedtimeHour}:00 PM`,
      activity: "Bedtime preparation",
      description: "Get ready for sleep with calming activities",
      category: "night",
    },
    {
      time: `${wakeHour}:00 AM`,
      activity: "Wake up",
      description: "Start your day with natural light exposure",
      category: "morning",
    },
  ];
}

export const handleSleepAssistant: RequestHandler = async (req, res) => {
  try {
    const { message, currentSchedule, userInfo }: SleepAssistantRequest =
      req.body;

    if (!message) {
      const response: SleepAssistantResponse = {
        response:
          "Please provide a message for me to help you with your sleep schedule.",
        success: false,
        error: "No message provided",
      };
      return res.status(400).json(response);
    }

    if (!process.env.OPENAI_API_KEY) {
      const response: SleepAssistantResponse = {
        response:
          "I'm sorry, but the AI sleep assistant is currently unavailable. Please try again later.",
        success: false,
        error: "OpenAI API key not configured",
      };
      return res.status(500).json(response);
    }

    // Build context for the AI
    let contextMessage = `User question: "${message}"`;

    if (currentSchedule) {
      contextMessage += `\n\nCurrent sleep schedule:
- Bedtime: ${currentSchedule.bedtime}
- Wake-up time: ${currentSchedule.wakeup}
- Sleep goal: ${currentSchedule.sleepGoal} hours`;
    }

    if (userInfo) {
      contextMessage += `\n\nUser information:`;
      if (userInfo.age) contextMessage += `\n- Age: ${userInfo.age}`;
      if (userInfo.lifestyle)
        contextMessage += `\n- Lifestyle: ${userInfo.lifestyle}`;
      if (userInfo.workSchedule)
        contextMessage += `\n- Work schedule: ${userInfo.workSchedule}`;
      if (userInfo.sleepIssues?.length) {
        contextMessage += `\n- Sleep issues: ${userInfo.sleepIssues.join(", ")}`;
      }
    }

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: LUNA_PROMPT,
        },
        {
          role: "user",
          content: contextMessage,
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      const response: SleepAssistantResponse = {
        response:
          "I'm having trouble generating a response right now. Please try again.",
        success: false,
        error: "No response from OpenAI",
      };
      return res.status(500).json(response);
    }

    // Try to extract recommendations from the response
    const recommendations = extractRecommendations(aiResponse);

    const response: SleepAssistantResponse = {
      response: aiResponse,
      recommendations,
      success: true,
    };

    res.json(response);
  } catch (error) {
    console.error("Sleep assistant error:", error);

    const response: SleepAssistantResponse = {
      response:
        "I'm experiencing some technical difficulties. Please try again in a moment.",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };

    res.status(500).json(response);
  }
};

// Helper function to extract structured recommendations from AI response
function extractRecommendations(response: string) {
  const recommendations: any = {};

  // Look for time patterns like "bedtime: 10:30 PM" or "go to bed at 22:30"
  const bedtimeMatch = response.match(
    /(?:bedtime|go to bed|sleep).*?(\d{1,2}:\d{2})/i,
  );
  if (bedtimeMatch) {
    recommendations.bedtime = bedtimeMatch[1];
  }

  // Look for wake-up times
  const wakeupMatch = response.match(/(?:wake|get up|rise).*?(\d{1,2}:\d{2})/i);
  if (wakeupMatch) {
    recommendations.wakeup = wakeupMatch[1];
  }

  // Look for sleep duration recommendations
  const durationMatch = response.match(/(\d+(?:\.\d+)?)\s*hours?.*?sleep/i);
  if (durationMatch) {
    recommendations.sleepDuration = parseFloat(durationMatch[1]);
  }

  // Extract tips (look for numbered lists or bullet points)
  const tipMatches = response.match(/(?:^|\n)\s*[\d\-\*•]\s*(.+)/gm);
  if (tipMatches) {
    recommendations.tips = tipMatches
      .map((tip) => tip.replace(/^[\s\d\-\*•]+/, "").trim())
      .filter((tip) => tip.length > 10)
      .slice(0, 3);
  }

  return Object.keys(recommendations).length > 0 ? recommendations : undefined;
}

export const handleMorningRoutineGeneration: RequestHandler = async (
  req,
  res,
) => {
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

    // Build detailed context from questionnaire data
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

    const openai = getOpenAIClient();
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
      // Try to parse JSON response
      const routineData = JSON.parse(aiResponse);

      // Validate that the response has the expected structure
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

      // If JSON parsing fails, return the fallback routine
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
};

// Fallback morning routine generation if AI response isn't in expected format
function generateFallbackMorningRoutine(data: any) {
  // Use desired wake time if available, fallback to current time
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

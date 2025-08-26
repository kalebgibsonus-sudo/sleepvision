import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

const LUNA_PROMPT = `You are Luna, an expert sleep optimization coach who creates transformation-level, highly personalized sleep schedules. Your goal is to create a schedule that feels like it was designed specifically for this user's unique situation, challenges, and lifestyle.

CRITICAL: Analyze their specific issues deeply and create targeted solutions:
- If they have trouble falling asleep → focus on anxiety reduction and mind-calming activities
- If they wake up frequently → emphasize sleep environment optimization
- If they have high stress → include multiple stress-reduction techniques
- If they use screens late → create compelling screen alternatives
- If they have irregular schedule → build consistency anchors
- If they have caffeine issues → time caffeine strategically

When creating a schedule, provide a JSON response with this exact structure:
{
  "summary": "Deep analysis of their sleep situation, specific challenges identified, and how this schedule addresses their unique needs with targeted solutions",
  "schedule": [
    {
      "time": "6:00 PM",
      "activity": "Strategic work transition",
      "description": "Complete work tasks and create a physical/mental boundary ritual to signal end of work mode",
      "category": "evening"
    }
  ],
  "recommendations": {
    "tips": ["Specific actionable tip addressing their main sleep issue", "Habit formation strategy personalized to their lifestyle", "Advanced optimization technique for their situation"]
  }
}

Schedule Categories:
- "evening": Activities from 6 PM to bedtime (wind-down preparation)
- "night": Sleep preparation and bedtime routine (1-2 hours before sleep)
- "morning": Wake-up routine and morning activities (first 2-3 hours after waking)

CRITICAL Guidelines for schedule creation:
- Create a COMPLETE daily schedule with 12-18 specific timed activities
- Start from their work end time and go through to 2-3 hours after wake time
- Use exact times in 12-hour format and base timing on THEIR DESIRED sleep/wake times
- Create smooth transitions between activities that feel natural and logical
- SPECIFICALLY target their mentioned sleep issues with evidence-based solutions
- Make each activity description actionable and specific (not generic advice)
- Address their stress level, lifestyle, work schedule, and caffeine habits directly
- Include their preferred activities where possible but optimize them for sleep
- Create "if-then" backup plans for challenging days
- Build in accountability and habit-formation elements
- Include environment optimization specific to their living situation
- Address their screen time habits with engaging alternatives they'll actually use

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

function generateFallbackSchedule(data: any) {
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

    const contextMessage = `Create a highly personalized, transformation-level sleep schedule for this user. Analyze their specific situation and create targeted solutions:

TIMING & GOALS:
- Age: ${questionnaireData.age}
- Sleep Goal: ${questionnaireData.sleepGoal} hours per night
- Current Pattern: Bed at ${questionnaireData.currentBedtime}, wake at ${questionnaireData.currentWakeTime}
- DESIRED SCHEDULE: Bed at ${questionnaireData.desiredBedtime}, wake at ${questionnaireData.desiredWakeTime} ⭐ USE THESE TIMES
- Current Sleep Quality: ${questionnaireData.sleepQuality}

SPECIFIC CHALLENGES TO ADDRESS:
- Sleep Issues: ${questionnaireData.sleepIssues.join(", ")} ⭐ CREATE TARGETED SOLUTIONS FOR THESE
- Stress Level: ${questionnaireData.stressLevel} ⭐ ADDRESS THIS DIRECTLY
- Screen Time Before Bed: ${questionnaireData.screenTime} ⭐ PROVIDE COMPELLING ALTERNATIVES

LIFESTYLE FACTORS:
- Lifestyle: ${questionnaireData.lifestyle}
- Work Schedule: ${questionnaireData.workSchedule}
- Caffeine Habits: ${questionnaireData.caffeine} ⭐ OPTIMIZE TIMING
- Exercise Habits: ${questionnaireData.exerciseHabits}
- Sleep Environment: ${questionnaireData.environment} ⭐ OPTIMIZE THIS

PERSONAL CONTEXT:
- Additional Information: ${questionnaireData.additionalInfo}

REQUIREMENTS:
1. Build the schedule around their DESIRED sleep/wake times
2. Create specific solutions for each sleep issue they mentioned
3. Address their stress level with multiple targeted techniques
4. Optimize their caffeine timing based on their habits
5. Provide engaging alternatives to their screen time habits
6. Make every activity feel personalized to their specific situation
7. Include backup plans for challenging days
8. Build in habit formation and accountability elements

Create a schedule that feels like a personal sleep transformation program, not generic advice.`;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

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
      const scheduleData = JSON.parse(aiResponse);

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
}

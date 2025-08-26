import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

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

function extractRecommendations(response: string) {
  const recommendations: any = {};

  const bedtimeMatch = response.match(
    /(?:bedtime|go to bed|sleep).*?(\d{1,2}:\d{2})/i,
  );
  if (bedtimeMatch) {
    recommendations.bedtime = bedtimeMatch[1];
  }

  const wakeupMatch = response.match(/(?:wake|get up|rise).*?(\d{1,2}:\d{2})/i);
  if (wakeupMatch) {
    recommendations.wakeup = wakeupMatch[1];
  }

  const durationMatch = response.match(/(\d+(?:\.\d+)?)\s*hours?.*?sleep/i);
  if (durationMatch) {
    recommendations.sleepDuration = parseFloat(durationMatch[1]);
  }

  const tipMatches = response.match(/(?:^|\n)\s*[\d\-\*•]\s*(.+)/gm);
  if (tipMatches) {
    recommendations.tips = tipMatches
      .map((tip) => tip.replace(/^[\s\d\-\*•]+/, "").trim())
      .filter((tip) => tip.length > 10)
      .slice(0, 3);
  }

  return Object.keys(recommendations).length > 0 ? recommendations : undefined;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, currentSchedule, userInfo } = req.body;

    if (!message) {
      return res.status(400).json({
        response:
          "Please provide a message for me to help you with your sleep schedule.",
        success: false,
        error: "No message provided",
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        response:
          "I'm sorry, but the AI sleep assistant is currently unavailable. Please try again later.",
        success: false,
        error: "OpenAI API key not configured",
      });
    }

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
      max_tokens: 800,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return res.status(500).json({
        response:
          "I'm having trouble generating a response right now. Please try again.",
        success: false,
        error: "No response from OpenAI",
      });
    }

    const recommendations = extractRecommendations(aiResponse);

    res.json({
      response: aiResponse,
      recommendations,
      success: true,
    });
  } catch (error) {
    console.error("Sleep assistant error:", error);

    res.status(500).json({
      response:
        "I'm experiencing some technical difficulties. Please try again in a moment.",
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

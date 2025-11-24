// This file contains comprehensive modifications and breathing patterns for all birth ball exercises
// Import this data and merge it into birthBallExercises in birthBallGuideData.ts

import { ExerciseModification, BreathingPattern } from './birthBallGuideData';

export const exerciseEnhancements: Record<string, {
  modifications: ExerciseModification[];
  breathingPattern: BreathingPattern;
}> = {
  // Pelvic Tilts modifications and breathing
  'pelvic-tilts-1': {
    modifications: [
      {
        title: "Chair-Supported Version",
        whenToUse: "If you cannot safely use a birth ball or have severe pelvic pain",
        description: "Perform the same pelvic tilting motion while seated in a sturdy chair",
        instructions: [
          "Sit upright in a sturdy chair with feet flat on floor",
          "Place hands on knees for support",
          "Tilt pelvis forward and backward with smaller range of motion",
          "Focus on the feeling of movement rather than depth"
        ]
      },
      {
        title: "Wall-Supported Standing",
        whenToUse: "For those with better balance standing than sitting",
        description: "Practice pelvic tilts while standing against a wall",
        instructions: [
          "Stand with back against wall, feet 6 inches away",
          "Tilt pelvis to arch lower back away from wall",
          "Tilt pelvis to press lower back into wall",
          "Move slowly and maintain wall contact for stability"
        ]
      },
      {
        title: "Side-Lying on Bed",
        whenToUse: "For bed rest or extreme mobility restrictions",
        description: "Gentle pelvic movement while lying on your side",
        instructions: [
          "Lie on your left side with pillow between knees",
          "Gently tilt pelvis forward and backward",
          "Very small movements focused on pelvic awareness",
          "Use pillow support for comfort"
        ]
      }
    ],
    breathingPattern: {
      name: "Coordinated Rocking Breath",
      description: "Synchronize your breath with the pelvic tilt movement for enhanced mind-body connection",
      pattern: [
        "Inhale as you tilt your pelvis forward (arching lower back)",
        "Exhale as you tilt your pelvis backward (rounding lower back)",
        "Keep the breath smooth and match the speed of movement",
        "Aim for 4-second inhale and 4-second exhale"
      ],
      timing: "One complete breath cycle per tilt",
      benefits: [
        "Enhances mind-body connection",
        "Promotes relaxation during movement",
        "Helps maintain steady, controlled pace",
        "Prepares coordinated breathing for labor"
      ]
    }
  },

  // Hip Circles modifications and breathing
  'hip-circles-1': {
    modifications: [
      {
        title: "Smaller Circles (Reduced Range)",
        whenToUse: "If you experience pelvic pain or SPD (symphysis pubis dysfunction)",
        description: "Make tiny, controlled circles focusing on mobility without pain",
        instructions: [
          "Sit on the ball with extra support nearby",
          "Make very small, gentle circles",
          "Stay within your comfort range",
          "Focus on smooth movement rather than size"
        ]
      },
      {
        title: "Standing Hip Circles",
        whenToUse: "If sitting is uncomfortable or you prefer standing",
        description: "Perform hip circles in a standing position with wall support",
        instructions: [
          "Stand next to a wall or sturdy surface for balance",
          "Place feet hip-width apart",
          "Circle hips gently, using wall for support as needed",
          "Keep knees soft and relaxed"
        ]
      },
      {
        title: "Partner-Assisted",
        whenToUse: "When you need extra stability or reassurance",
        description: "Have your partner provide hands-on support while you practice",
        instructions: [
          "Sit on ball with partner standing in front",
          "Partner holds your hands for stability",
          "Make gentle circles with added confidence",
          "Partner can guide the movement if needed"
        ]
      }
    ],
    breathingPattern: {
      name: "Circular Breathing",
      description: "Coordinate your breath with the circular hip movement for relaxation and focus",
      pattern: [
        "Begin with a deep inhale as you start the circle",
        "Exhale slowly and completely as you complete the circle",
        "Inhale again on the next circle",
        "Maintain steady, rhythmic breathing throughout"
      ],
      timing: "One complete breath cycle per hip circle",
      benefits: [
        "Enhances mind-body connection",
        "Promotes relaxation during movement",
        "Helps maintain steady, controlled pace",
        "Prepares breathing techniques for labor"
      ]
    }
  },

  // Deep Breathing exercise (already a breathing exercise, but adding modifications)
  'deep-breathing-1': {
    modifications: [
      {
        title: "Lying Down Version",
        whenToUse: "When you're feeling dizzy, nauseous, or need to rest",
        description: "Practice deep breathing while lying on your left side",
        instructions: [
          "Lie on your left side with pillow support",
          "Place one hand on chest, one on belly",
          "Breathe deeply and slowly",
          "Focus on belly expanding with each breath"
        ]
      },
      {
        title: "Standing or Walking",
        whenToUse: "When you can't sit comfortably or want to combine with gentle movement",
        description: "Practice breathing while standing or taking slow steps",
        instructions: [
          "Stand with soft knees or walk very slowly",
          "Maintain good posture",
          "Breathe deeply in through nose, out through mouth",
          "Can place hands on belly to feel movement"
        ]
      }
    ],
    breathingPattern: {
      name: "4-6 Calming Breath",
      description: "Longer exhale than inhale activates relaxation response",
      pattern: [
        "Inhale slowly through your nose for 4 counts",
        "Exhale slowly through your mouth for 6 counts",
        "Feel your belly expand with each inhale",
        "Feel your body relax with each exhale"
      ],
      timing: "Continuous practice for 2-3 minutes or as long as comfortable",
      benefits: [
        "Activates parasympathetic nervous system",
        "Reduces anxiety and stress",
        "Improves oxygen flow to baby",
        "Prepares breathing for labor contractions"
      ]
    }
  },

  // Supported Squats modifications and breathing
  'supported-squats-2': {
    modifications: [
      {
        title: "Counter or Chair Support",
        whenToUse: "If you don't have a birth ball or need more stable support",
        description: "Use a kitchen counter or sturdy chair back for support",
        instructions: [
          "Stand facing a counter or chair back",
          "Hold onto surface for support",
          "Lower into squat position slowly",
          "Keep knees aligned over toes"
        ]
      },
      {
        title: "Shallow Squat",
        whenToUse: "If deep squats cause pain or you're building strength",
        description: "Perform partial squats to reduce intensity",
        instructions: [
          "Set up with ball against wall as usual",
          "Only lower partway down (mini squat)",
          "Focus on good form over depth",
          "Gradually increase depth as strength builds"
        ]
      },
      {
        title: "Isometric Hold",
        whenToUse: "To build endurance without repetitive movement",
        description: "Hold the squat position statically for a few seconds",
        instructions: [
          "Lower into comfortable squat position",
          "Hold for 5-10 seconds",
          "Rest and repeat",
          "Build up holding time gradually"
        ]
      }
    ],
    breathingPattern: {
      name: "Squat Breath",
      description: "Controlled breathing to support the squat movement",
      pattern: [
        "Inhale as you prepare to squat",
        "Exhale steadily as you lower down",
        "Breathe normally at bottom of squat",
        "Inhale as you push back up to standing"
      ],
      timing: "One breath cycle per squat repetition",
      benefits: [
        "Provides energy for the movement",
        "Prevents breath-holding and tension",
        "Builds stamina for labor positions",
        "Improves muscular endurance"
      ]
    }
  },

  // Slow Bounces (Trimester 3)
  'slow-bounces-3': {
    modifications: [
      {
        title: "Seated Rocking Instead",
        whenToUse: "If bouncing feels uncomfortable or you're advised against it",
        description: "Replace bouncing with gentle rocking motions",
        instructions: [
          "Sit on ball with feet firmly planted",
          "Rock gently front to back instead of bouncing",
          "Keep movements very controlled",
          "Focus on pelvic mobility"
        ]
      },
      {
        title: "Extra Support Version",
        whenToUse: "If you need more stability or feel unsteady",
        description: "Use wall and partner support for maximum safety",
        instructions: [
          "Position ball near wall",
          "Have partner stand in front for added support",
          "Make tiny bouncing movements",
          "Stop immediately if anything feels off"
        ]
      }
    ],
    breathingPattern: {
      name: "Rhythmic Bounce Breath",
      description: "Gentle breathing to match the bouncing rhythm",
      pattern: [
        "Breathe in a steady, natural rhythm",
        "Don't hold your breath during bounces",
        "Keep breath light and continuous",
        "Focus on staying relaxed"
      ],
      timing: "Natural, rhythmic breathing throughout",
      benefits: [
        "Maintains relaxation during movement",
        "Prevents tension build-up",
        "Encourages optimal baby positioning",
        "Prepares for labor breathing"
      ]
    }
  },

  // Figure-8s modifications and breathing
  'seated-figure-8s-3': {
    modifications: [
      {
        title: "Simplified Version",
        whenToUse: "If the figure-8 pattern feels too complex",
        description: "Practice simpler hip circles first, then add figure-8",
        instructions: [
          "Start with basic hip circles to warm up",
          "Gradually make the circles more oval",
          "Slowly transition to figure-8 pattern",
          "Focus on smooth movement over perfect shape"
        ]
      },
      {
        title: "Hands-On Support",
        whenToUse: "When you need extra stability",
        description: "Hold onto a stable surface while practicing",
        instructions: [
          "Position ball near a wall or table",
          "Place hands on surface for support",
          "Practice figure-8 movement",
          "Use support to maintain balance"
        ]
      }
    ],
    breathingPattern: {
      name: "Flowing Figure-8 Breath",
      description: "Smooth breathing pattern matching the flowing movement",
      pattern: [
        "Inhale during first half of figure-8",
        "Exhale during second half",
        "Keep breath smooth and continuous",
        "Match breathing speed to movement"
      ],
      timing: "One complete breath per figure-8",
      benefits: [
        "Promotes fluid, graceful movement",
        "Enhances pelvic mobility",
        "Prepares for labor positions",
        "Builds mind-body awareness"
      ]
    }
  },

  // Forward Lean modifications and breathing
  'forward-lean-breathing-3': {
    modifications: [
      {
        title: "Bed or Couch Version",
        whenToUse: "If you can't kneel comfortably or don't have a ball",
        description: "Lean forward onto a bed or couch instead",
        instructions: [
          "Kneel beside your bed or couch",
          "Fold arms and rest upper body forward",
          "Let belly hang comfortably",
          "Add pillows for extra support if needed"
        ]
      },
      {
        title: "Pillow Support",
        whenToUse: "If kneeling on floor is uncomfortable",
        description: "Use pillows or cushions under knees",
        instructions: [
          "Place thick pillow or yoga mat under knees",
          "Lean forward onto ball as usual",
          "Adjust pillow thickness for comfort",
          "Can also use pillow under ankles if needed"
        ]
      }
    ],
    breathingPattern: {
      name: "Resting Labor Breath",
      description: "Deep, calming breath perfect for managing contractions",
      pattern: [
        "Breathe slowly and deeply through your nose",
        "Exhale with a sigh through your mouth",
        "Feel your belly and chest expand fully",
        "Focus on complete relaxation with each breath"
      ],
      timing: "Slow, deep breaths for 2-3 minutes or longer",
      benefits: [
        "Deeply calming and restorative",
        "Perfect position for labor rest",
        "Reduces back pain and pressure",
        "Encourages optimal fetal positioning"
      ]
    }
  }
};

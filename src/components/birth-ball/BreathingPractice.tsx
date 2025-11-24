import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  inhaleCount: number;
  holdCount?: number;
  exhaleCount: number;
  holdAfterExhale?: number;
  benefits: string[];
  bestFor: string;
}

const breathingTechniques: BreathingTechnique[] = [
  {
    id: '4-6-breathing',
    name: '4-6 Breathing (Calming)',
    description: 'Inhale for 4 counts, exhale for 6 counts. Perfect for relaxation and labor preparation.',
    inhaleCount: 4,
    exhaleCount: 6,
    benefits: [
      'Activates parasympathetic nervous system',
      'Reduces anxiety and stress',
      'Prepares for labor breathing',
      'Improves oxygen flow to baby'
    ],
    bestFor: 'Daily practice, early labor, anxiety relief'
  },
  {
    id: 'box-breathing',
    name: 'Box Breathing (4-4-4-4)',
    description: 'Equal counts for inhale, hold, exhale, hold. Great for focus and centering.',
    inhaleCount: 4,
    holdCount: 4,
    exhaleCount: 4,
    holdAfterExhale: 4,
    benefits: [
      'Balances nervous system',
      'Improves mental clarity',
      'Reduces panic and fear',
      'Builds breath control'
    ],
    bestFor: 'Anxiety, pre-labor preparation, meditation'
  },
  {
    id: 'golden-thread',
    name: 'Golden Thread Breathing',
    description: 'Short inhale, very long slow exhale through pursed lips. Excellent for contractions.',
    inhaleCount: 3,
    exhaleCount: 8,
    benefits: [
      'Helps manage contraction pain',
      'Promotes relaxation between contractions',
      'Prevents hyperventilation',
      'Provides mental focus point'
    ],
    bestFor: 'Active labor, managing contractions'
  },
  {
    id: 'triangle-breathing',
    name: 'Triangle Breathing (4-4-4)',
    description: 'Inhale, hold, exhale in equal counts. Simple and grounding.',
    inhaleCount: 4,
    holdCount: 4,
    exhaleCount: 4,
    benefits: [
      'Simple to remember under stress',
      'Grounds and centers',
      'Improves breath awareness',
      'Easy to practice anywhere'
    ],
    bestFor: 'Beginners, quick calming, everyday practice'
  }
];

const BreathingPractice = () => {
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique>(breathingTechniques[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'hold-after'>('inhale');
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCount(prev => {
          const maxCount = getPhaseCount();
          if (prev >= maxCount - 1) {
            moveToNextPhase();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentPhase, selectedTechnique]);

  const getPhaseCount = () => {
    switch (currentPhase) {
      case 'inhale':
        return selectedTechnique.inhaleCount;
      case 'hold':
        return selectedTechnique.holdCount || 0;
      case 'exhale':
        return selectedTechnique.exhaleCount;
      case 'hold-after':
        return selectedTechnique.holdAfterExhale || 0;
      default:
        return 0;
    }
  };

  const moveToNextPhase = () => {
    switch (currentPhase) {
      case 'inhale':
        if (selectedTechnique.holdCount) {
          setCurrentPhase('hold');
        } else {
          setCurrentPhase('exhale');
        }
        break;
      case 'hold':
        setCurrentPhase('exhale');
        break;
      case 'exhale':
        if (selectedTechnique.holdAfterExhale) {
          setCurrentPhase('hold-after');
        } else {
          setCurrentPhase('inhale');
          setCycles(prev => prev + 1);
        }
        break;
      case 'hold-after':
        setCurrentPhase('inhale');
        setCycles(prev => prev + 1);
        break;
    }
  };

  const handlePlayPause = () => {
    if (!isPlaying && cycles === 0) {
      toast.success('Starting breathing practice');
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentPhase('inhale');
    setCount(0);
    setCycles(0);
  };

  const getCircleScale = () => {
    const progress = count / getPhaseCount();
    if (currentPhase === 'inhale') {
      return 0.5 + (progress * 0.5); // Scale from 0.5 to 1
    } else if (currentPhase === 'exhale') {
      return 1 - (progress * 0.5); // Scale from 1 to 0.5
    }
    return 1; // Hold phases stay at full size
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'hold-after':
        return 'Hold';
      default:
        return '';
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'from-blue-500 to-cyan-500';
      case 'hold':
        return 'from-purple-500 to-pink-500';
      case 'exhale':
        return 'from-orange-500 to-red-500';
      case 'hold-after':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-primary to-primary';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Breathing Practice Tool</h2>
        <p className="text-muted-foreground">
          Practice breathing techniques that you can use during pregnancy, labor, and everyday life.
        </p>
      </div>

      {/* Technique Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {breathingTechniques.map((technique) => (
          <Card
            key={technique.id}
            className={`cursor-pointer transition-all ${
              selectedTechnique.id === technique.id
                ? 'border-primary shadow-md'
                : 'hover:border-primary/50'
            }`}
            onClick={() => {
              setSelectedTechnique(technique);
              handleReset();
            }}
          >
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                {technique.name}
                {selectedTechnique.id === technique.id && (
                  <Badge variant="default">Selected</Badge>
                )}
              </CardTitle>
              <CardDescription>{technique.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-2">
                <strong>Best for:</strong> {technique.bestFor}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Breathing Visualizer */}
      <Card className="border-primary/20">
        <CardContent className="pt-8">
          <div className="flex flex-col items-center space-y-6">
            {/* Animated Breathing Circle */}
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div
                className={`absolute rounded-full bg-gradient-to-br ${getPhaseColor()} transition-all duration-1000 ease-in-out flex items-center justify-center`}
                style={{
                  width: `${getCircleScale() * 200}px`,
                  height: `${getCircleScale() * 200}px`,
                  opacity: 0.3 + (getCircleScale() * 0.4)
                }}
              >
                <div className="text-white text-center">
                  <div className="text-2xl font-bold">{getPhaseText()}</div>
                  <div className="text-6xl font-bold mt-2">{count + 1}</div>
                </div>
              </div>
            </div>

            {/* Phase Indicator */}
            <div className="text-center space-y-2">
              <div className="text-sm text-muted-foreground">Current Phase</div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {getPhaseText()} ({count + 1}/{getPhaseCount()})
              </Badge>
            </div>

            {/* Cycle Counter */}
            {cycles > 0 && (
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Completed Cycles</div>
                <div className="text-2xl font-bold text-primary">{cycles}</div>
              </div>
            )}

            {/* Controls */}
            <div className="flex gap-3">
              <Button onClick={handlePlayPause} size="lg">
                {isPlaying ? (
                  <>
                    <Pause className="mr-2 h-5 w-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    {cycles > 0 ? 'Resume' : 'Start'}
                  </>
                )}
              </Button>
              <Button onClick={handleReset} variant="outline" size="lg">
                <RotateCcw className="mr-2 h-5 w-5" />
                Reset
              </Button>
            </div>

            {/* Current Pattern Info */}
            <Card className="w-full bg-muted/50">
              <CardHeader>
                <CardTitle className="text-base">Pattern: {selectedTechnique.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Inhale:</span>
                    <span className="font-medium">{selectedTechnique.inhaleCount} seconds</span>
                  </div>
                  {selectedTechnique.holdCount && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hold:</span>
                      <span className="font-medium">{selectedTechnique.holdCount} seconds</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Exhale:</span>
                    <span className="font-medium">{selectedTechnique.exhaleCount} seconds</span>
                  </div>
                  {selectedTechnique.holdAfterExhale && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hold:</span>
                      <span className="font-medium">{selectedTechnique.holdAfterExhale} seconds</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <div className="w-full">
              <h3 className="font-semibold mb-3">Benefits</h3>
              <ul className="space-y-2">
                {selectedTechnique.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-1">•</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BreathingPractice;

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Box, VStack, Text, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toaster } from "@/components/ui/toaster";
import { Volume2, VolumeX } from "lucide-react";

type ButtonSize = "sm" | "md" | "lg" | "xl" | "2xl";

const happyGifs = [
  "https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif", // Original happy bear
  "https://media.giphy.com/media/108M7gCS1JSoO4/giphy.gif", // Happy jumping
  "https://media.giphy.com/media/DhstvI3zZ598Nb1rFf/giphy.gif", // Cute dance
  "https://media.giphy.com/media/chzz1FQgqhytWRWbp3/giphy.gif", // Happy cat
  "https://media.giphy.com/media/MeIucAjPKoA120R7sN/giphy.gif", // Happy dance
];

const sadGifs = [
  "https://media.giphy.com/media/L95W4wv8nnb9K/giphy.gif", // Crying cat
  "https://media.giphy.com/media/d2lcHJTG5Tscg/giphy.gif", // Crying baby
  "https://media.giphy.com/media/OPU6wzx8JrHna/giphy.gif", // Crying cat 2
  "https://media.giphy.com/media/2rtQMJvhzOnRe/giphy.gif", // Sad bear
  "https://media.giphy.com/media/qQdL532ZANbjy/giphy.gif", // Sad cat
];

const noMessages = [
  "Are you sure? 🥺",
  "Really sure? 😢",
  "Think again! 💭",
  "Last chance! 💝",
  "Surely not? 🥹",
  "You might regret this! 🫣",
  "Give it another thought! 🤔",
  "Are you absolutely certain? 😩",
  "This is your final chance! 🥺",
  "Don&apos;t do this to me! 😭",
];

const cryingEmojis = ["😢", "😭", "🥺", "😿", "💔"];

const FloatingEmoji = ({ index, emoji }: { index: number; emoji: string }) => {
  return (
    <motion.div
      style={{
        position: "absolute",
        fontSize: "1.5rem",
        top: "-20px",
        left: `${index * 8}%`,
        opacity: 0,
      }}
      animate={{
        y: ["0vh", "100vh"],
        x: [0, Math.random() * 100 - 50],
        opacity: [0, 1, 1, 0],
        rotate: [-30, 30],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        delay: index * 0.3,
        repeat: Infinity,
        repeatDelay: Math.random() * 2,
        ease: "linear",
        times: [0, 0.2, 0.8, 1],
      }}
    >
      {emoji}
    </motion.div>
  );
};

const CryingBackground = () => {
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      overflow="hidden"
      pointerEvents="none"
      zIndex={0}
    >
      {Array.from({ length: 15 }).map((_, i) => (
        <FloatingEmoji
          key={i}
          index={i}
          emoji={cryingEmojis[i % cryingEmojis.length]}
        />
      ))}
    </Box>
  );
};

const FloatingHeart = ({ index }: { index: number }) => {
  return (
    <motion.div
      style={{
        position: "absolute",
        fontSize: "2rem",
        top: "-20px",
        left: `${index * 10}%`,
        opacity: 0,
      }}
      animate={{
        y: ["0vh", "100vh"],
        x: [0, Math.random() * 100 - 50],
        opacity: [0, 1, 1, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 5,
        delay: index * 0.4,
        repeat: Infinity,
        repeatDelay: Math.random() * 3,
        ease: "linear",
        times: [0, 0.2, 0.8, 1],
      }}
    >
      💝
    </motion.div>
  );
};

const HeartBackground = () => {
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      overflow="hidden"
      pointerEvents="none"
      zIndex={0}
    >
      {Array.from({ length: 20 }).map((_, i) => (
        <FloatingHeart key={i} index={i} />
      ))}
    </Box>
  );
};

const MusicPlayer = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.25;
      audioRef.current.loop = true;
    }

    const handleFirstInteraction = () => {
      if (audioRef.current && isMuted) {
        audioRef.current
          .play()
          .then(() => {
            setIsMuted(false);
            document.removeEventListener("click", handleFirstInteraction);
          })
          .catch((error) => {
            console.error("Playback failed:", error);
            setIsLoaded(true);
          });
      }
    };

    document.addEventListener("click", handleFirstInteraction);
    return () => document.removeEventListener("click", handleFirstInteraction);
  }, [isMuted]);

  const toggleMute = () => {
    if (!audioRef.current) return;

    try {
      if (isMuted) {
        audioRef.current
          .play()
          .then(() => {
            setIsMuted(false);
            setIsLoaded(true);
          })
          .catch(() => {
            setIsLoaded(true);
            toaster.create({
              title: "🎵 Click anywhere to enable music",
              description: "Browser requires a page interaction first",
              type: "info",
              duration: 3000,
            });
          });
      } else {
        audioRef.current.pause();
        setIsMuted(true);
      }
    } catch (error) {
      console.error("Audio control error:", error);
      setIsLoaded(true);
    }
  };

  const handleLoadedData = () => {
    setIsLoaded(true);
    toaster.create({
      title: "🎵 Music ready!",
      description: "Click the button to play romantic music",
      type: "info",
      duration: 3000,
    });
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/romantic-pop1-297157.mp3"
        preload="auto"
        onLoadedData={handleLoadedData}
        onError={(e) => {
          console.error("Audio loading error:", e);
          setIsLoaded(true);
          toaster.create({
            title: "🎵 Music unavailable",
            description: "Don't worry, the love is still in the air! ❤️",
            type: "info",
            duration: 3000,
          });
        }}
      />
      <Button
        size="sm"
        variant="ghost"
        onClick={toggleMute}
        disabled={!isLoaded}
        className="fixed bottom-4 right-4 z-50 bg-pink-100/80 hover:bg-pink-200/90 backdrop-blur-sm shadow-lg"
        aria-label={isMuted ? "Play romantic melody" : "Pause melody"}
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4 text-pink-500" />
        ) : (
          <Volume2 className="h-4 w-4 text-pink-500" />
        )}
      </Button>
    </>
  );
};

export default function Home() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [buttonSize, setButtonSize] = useState<ButtonSize>("md");
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [currentGif, setCurrentGif] = useState(0);

  const handleNoClick = useCallback(() => {
    setNoCount((count) => count + 1);
    setButtonSize((prev) => (prev === "md" ? "sm" : "md"));
    setNoButtonPosition({
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
    });
    setCurrentGif((prev) => (prev + 1) % sadGifs.length);
  }, []);

  const getNoButtonText = () => {
    return noCount >= noMessages.length
      ? "I&apos;ll keep asking... 😤"
      : noMessages[noCount];
  };

  const getYesButtonSize = (): ButtonSize => {
    if (noCount === 0) return "md";
    if (noCount <= 2) return "lg";
    if (noCount <= 4) return "xl";
    return "2xl";
  };

  const getYesButtonScale = () => {
    return 1 + Math.min(noCount * 0.15, 1); // Increases size by 15% each time, up to 2x
  };

  if (yesPressed) {
    return (
      <Box
        h="100vh"
        w="100vw"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgGradient="linear(to-r, pink.200, purple.200)"
        position="relative"
        overflow="hidden"
      >
        <HeartBackground />
        <VStack gap={8} zIndex={1}>
          <Text
            fontSize="4xl"
            fontWeight="bold"
            bgGradient="linear(to-r, pink.500, purple.500)"
            bgClip="text"
          >
            Yaaay! I knew you&apos;d say yes! 🎉
          </Text>
          <Image
            src={happyGifs[currentGif]}
            alt="Celebration"
            rounded="lg"
            shadow="2xl"
            maxW="300px"
          />
        </VStack>
      </Box>
    );
  }

  return (
    <>
      <MusicPlayer />
      <Box
        h="100vh"
        w="100vw"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgGradient="linear(to-r, pink.100, purple.100)"
        position="relative"
        overflow="hidden"
      >
        {noCount === 0 ? <HeartBackground /> : <CryingBackground />}
        <VStack gap={8} zIndex={1}>
          <Image
            src={
              noCount === 0
                ? "https://media.giphy.com/media/LnKonfpQ44fNvuGLkA/giphy.gif"
                : sadGifs[currentGif]
            }
            alt={noCount === 0 ? "Cute Valentine" : "Sad Reaction"}
            rounded="lg"
            shadow="xl"
            mb={4}
            maxW="300px"
          />
          <Text
            fontSize="3xl"
            fontWeight="bold"
            textAlign="center"
            bgGradient="linear(to-r, pink.500, purple.500)"
            bgClip="text"
          >
            Will you be my Valentine? 💝
          </Text>
          <Box
            position="relative"
            w="full"
            display="flex"
            justifyContent="center"
            gap={4}
            zIndex={2}
          >
            <motion.div
              animate={{ scale: getYesButtonScale() }}
              transition={{ duration: 0.2 }}
            >
              <Button
                size={getYesButtonSize()}
                colorPalette="pink"
                variant="subtle"
                px={4}
                onClick={() => {
                  setYesPressed(true);
                  setCurrentGif(Math.floor(Math.random() * happyGifs.length));
                  toaster.create({
                    title: "💖 Thank you! 💖",
                    description: "I&apos;m so happy you said yes!",
                    type: "success",
                    duration: 3000,
                  });
                }}
              >
                Yes! 💖
              </Button>
            </motion.div>
            <motion.div
              style={{
                position: "relative",
                display: "inline-block",
              }}
              animate={noButtonPosition}
              transition={{ duration: 0.2 }}
            >
              <Button
                size={buttonSize}
                colorPalette="gray"
                variant="subtle"
                onClick={handleNoClick}
                px={4}
              >
                {getNoButtonText()}
              </Button>
            </motion.div>
          </Box>
        </VStack>
      </Box>
    </>
  );
}

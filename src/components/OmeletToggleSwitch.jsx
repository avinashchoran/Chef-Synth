import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import { TweenMax, Elastic } from 'gsap/all';

const OmeletToggleSwitch = ({ isOn }) => {
  const animationContainerRef = useRef(null);
  const animationRef = useRef(null);
  const previousIsOnRef = useRef(null); // Track previous value
  const hasInitialized = useRef(false); // To prevent animation on first load

  useEffect(() => {
    if (!animationContainerRef.current) return;

    const anim = lottie.loadAnimation({
      container: animationContainerRef.current,
      renderer: 'svg',
      loop: false,
      prerender: false,
      autoplay: false,
      path: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/35984/egg_flip.json',
    });

    animationRef.current = anim;
    anim.setSpeed(15);

    const eggGroup = () =>
      animationContainerRef.current?.querySelector('.eggGroup');

    const setInitialState = () => {
      const group = eggGroup();
      if (!group) return;

      if (isOn) {
        anim.goToAndStop(300, true);
        TweenMax.set(group, { x: 73 });
      } else {
        anim.goToAndStop(0, true);
        TweenMax.set(group, { x: 0 });
      }

      previousIsOnRef.current = isOn;
      hasInitialized.current = true;
    };

    const handleClick = () => {
      const group = eggGroup();
      if (!group) return;

      if (anim.currentFrame > 0) {
        anim.playSegments([anim.currentFrame, 0], true);
        TweenMax.to(group, 1, {
          x: 0,
          ease: Elastic.easeOut.config(0.9, 0.38),
        });
      } else {
        TweenMax.to(group, 1.4, {
          x: 73,
          ease: Elastic.easeOut.config(0.9, 0.38),
        });
        anim.playSegments([anim.currentFrame, 300], true);
      }

      previousIsOnRef.current = !previousIsOnRef.current;
    };

    anim.addEventListener('DOMLoaded', () => {
      setInitialState();
      animationContainerRef.current.addEventListener('click', handleClick);
    });

    return () => {
      anim.destroy();
    };
  }, []);

  // React to `isOn` changes AFTER initial mount
  useEffect(() => {
    if (!hasInitialized.current || !animationRef.current) return;

    const group = animationContainerRef.current?.querySelector('.eggGroup');
    if (!group) return;

    const anim = animationRef.current;

    if (isOn && !previousIsOnRef.current) {
      TweenMax.to(group, 1.4, {
        x: 73,
        ease: Elastic.easeOut.config(0.9, 0.38),
      });
      anim.playSegments([anim.currentFrame, 300], true);
    } else if (!isOn && previousIsOnRef.current) {
      anim.playSegments([anim.currentFrame, 0], true);
      TweenMax.to(group, 1, {
        x: 0,
        ease: Elastic.easeOut.config(0.9, 0.38),
      });
    }

    previousIsOnRef.current = isOn;
  }, [isOn]);

  return <div id="animationWindow" ref={animationContainerRef}></div>;
};

export default OmeletToggleSwitch;

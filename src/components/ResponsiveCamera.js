import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

export default function ResponsiveCamera({ defaultFov = 45, mobileFov = 65 }) {
  const { camera, size } = useThree();

  useEffect(() => {
    // If the window width is less than 768px (standard mobile breakpoint)
    if (size.width < 768) {
      camera.fov = mobileFov;
    } else {
      camera.fov = defaultFov;
    }
    camera.updateProjectionMatrix();
  }, [size.width, camera, defaultFov, mobileFov]);

  return null;
}

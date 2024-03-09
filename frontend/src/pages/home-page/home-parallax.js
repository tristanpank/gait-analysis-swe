"use client";
import React from "react";
import { HeroParallax } from "../../components/ui/hero-parallax.tsx";
import LoginButton from "./login-button.js";

export function HomeParallax() {
  const title = "UF Gait Analysis";
  const body = (
    <div>
      <p className="mb-5"> A platform that analyzes running form for student athletes at UF, making the resources of expensive labs available for everyday runners": "A platform that analyzes running form for student athletes at UF, making the resources of expensive labs available for everyday runners</p>
      <LoginButton />
    </div>
  )


  return <HeroParallax products={products} title={title} body={body} />;
}
export const products = [
  {
    thumbnail:
      "https://images.pexels.com/photos/34514/spot-runs-start-la.jpg",
  },
  {
    thumbnail:
      "https://images.pexels.com/photos/5687446/pexels-photo-5687446.jpeg",
  },
  {
    thumbnail:
      "https://images.pexels.com/photos/5655118/pexels-photo-5655118.jpeg",
  },
  {
    thumbnail:
      "https://images.pexels.com/photos/18331253/pexels-photo-18331253/free-photo-of-runner-on-a-track-with-his-arms-raised-a-gesture-of-victory.jpeg",
  },
  {
    thumbnail:
      "https://images.pexels.com/photos/2284163/pexels-photo-2284163.jpeg",
  },
  {
    thumbnail:
      "https://images.pexels.com/photos/1571938/pexels-photo-1571938.jpeg",
  },
  {
    thumbnail:
      "https://images.pexels.com/photos/1555351/pexels-photo-1555351.jpeg",
  },
  {
    thumbnail:
      "https://images.pexels.com/photos/2168292/pexels-photo-2168292.jpeg",
  },
  {
    thumbnail:
      "https://images.pexels.com/photos/2886982/pexels-photo-2886982.jpeg",
  },
  {
    thumbnail:
      "https://images.pexels.com/photos/2600354/pexels-photo-2600354.jpeg",
  },
  {
    thumbnail:
      "https://images.pexels.com/photos/2403471/pexels-photo-2403471.jpeg",
  },
  {
    thumbnail:
      "https://images.pexels.com/photos/2421558/pexels-photo-2421558.jpeg",
  },
  {
    thumbnail:
      "https://images.pexels.com/photos/2421563/pexels-photo-2421563.jpeg",
  },
  {
    thumbnail:
      "https://images.pexels.com/photos/2403516/pexels-photo-2403516.jpeg",
  },
  {
    thumbnail:
      "https://images.pexels.com/photos/2403052/pexels-photo-2403052.jpeg",
  },
];

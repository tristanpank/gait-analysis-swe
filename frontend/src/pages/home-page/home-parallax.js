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
      "https://images.pexels.com/photos/34514/spot-runs-start-la.jpg",
  },
  {
    thumbnail:
      "https://images.pexels.com/photos/34514/spot-runs-start-la.jpg",
  },
  {
    thumbnail:
      "https://images.pexels.com/photos/34514/spot-runs-start-la.jpg",
  },
  {
    thumbnail:
      "https://images.pexels.com/photos/34514/spot-runs-start-la.jpg",
  },
  {
    thumbnail:
      "https://images.pexels.com/photos/34514/spot-runs-start-la.jpg",
  },
  {
    thumbnail:
      "https://images.pexels.com/photos/34514/spot-runs-start-la.jpg",
  },
  {
    thumbnail:
      "https://images.pexels.com/photos/34514/spot-runs-start-la.jpg",
  },
  {
    thumbnail:
      "https://images.pexels.com/photos/34514/spot-runs-start-la.jpg",
  },
  {
    thumbnail:
      "https://images.pexels.com/photos/34514/spot-runs-start-la.jpg",
  },
  {
    thumbnail:
      "https://images.pexels.com/photos/34514/spot-runs-start-la.jpg",
  },
  {
    thumbnail:
      "https://images.pexels.com/photos/34514/spot-runs-start-la.jpg",
  },
  {
    thumbnail:
      "https://images.pexels.com/photos/34514/spot-runs-start-la.jpg",
  },
  
];

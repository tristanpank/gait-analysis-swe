"use client";
import React from "react";
import { HeroParallax } from "../../components/ui/hero-parallax.tsx";
import LoginButton from "./login-button.js";


const image1 = require("./images/image1.jpeg");
const image2 = require("./images/image2.jpeg");
const image3 = require("./images/image3.jpeg");
const image4 = require("./images/image4.jpeg");
const image5 = require("./images/image5.jpeg");
const image6 = require("./images/image6.jpeg");
const image7 = require("./images/image7.jpeg");
const image8 = require("./images/image8.jpeg");
const image9 = require("./images/image9.jpeg");
const image10 = require("./images/image10.jpeg");
const image11 = require("./images/image11.jpeg");
const image12 = require("./images/image12.jpeg");
const image13 = require("./images/image13.jpeg");
const image14 = require("./images/image14.jpeg");
const image15 = require("./images/image15.jpeg");

export function HomeParallax() {
  const title = "UF Gait Analysis";
  const body = (
    <div data-testid="Parallax">
      <p className="mb-5"> A platform that analyzes running form for student athletes at UF, making the resources of expensive labs available for everyday runners.</p>
      <LoginButton />
    </div>
  )


  return <HeroParallax products={products} title={title} body={body} />;
}


export const products = [
  {
    title: "1",
    thumbnail:
      image1
  },
  {
    title: "2",
    thumbnail:
      image2
  },
  {
    title: "3",
    thumbnail:
    image3
  },
  {
    title: "4",
    thumbnail:
    image4,
  },
  {
    title: "5",
    thumbnail:
      image5,
  },
  {
    title: "6",
    thumbnail:
      image6,
  },
  {
    title: "7",
    thumbnail:
      image7,
  },
  {
    title: "8",
    thumbnail:
      image8,
  },
  {
    title: "9",
    thumbnail:
      image9,
  },
  {
    title: "10",
    thumbnail:
      image10,
  },
  {
    title: "11",
    thumbnail:
      image11,
  },
  {
    title: "12",
    thumbnail:
      image12,
  },
  {
    title: "13",
    thumbnail:
      image13,
  },
  {
    title: "14",
    thumbnail:
      image14,
  },
  {
    title: "15",
    thumbnail:
      image15,
  },
];

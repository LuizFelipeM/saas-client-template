"use client";

import { Button } from "./ui/button";

export default function Name() {
  return (
    <>
      <span>Just wait</span>
      <Button onClick={() => console.log("click")}>Your button</Button>
    </>
  );
}

"use client";

import { useState } from "react";
import SuccessfulSignup from "@/components/register/SuccessfulSignup";
import Form from "@/components/register/Form";

export default function Signup() {
  const [hasSuccessfullySignedUp, setHasSuccessfullySignedUp] = useState(false);

  return (
    <div className="my-24 flex flex-grow items-center justify-center px-4 md:px-0">
      {hasSuccessfullySignedUp ? (
        <SuccessfulSignup />
      ) : (
        <Form onSuccessfulSignup={() => setHasSuccessfullySignedUp(true)} />
      )}
    </div>
  );
}

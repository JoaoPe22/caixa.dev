'use client'

import { domAnimation, LazyMotion } from 'framer-motion'
import React from 'react'

const MotionProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  )
}

export { MotionProvider }

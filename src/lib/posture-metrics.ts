import type { PoseLandmark, PostureMetrics } from "@/types/posture-analysis"

export const POSE_LANDMARK = {
  NOSE: 0,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
} as const

function tiltDeg(a: PoseLandmark, b: PoseLandmark): number {
  const [p1, p2] = a.x <= b.x ? [a, b] : [b, a]
  return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI
}

export function computePostureMetrics(landmarks: PoseLandmark[]): PostureMetrics {
  const nose = landmarks[POSE_LANDMARK.NOSE]
  const leftShoulder = landmarks[POSE_LANDMARK.LEFT_SHOULDER]
  const rightShoulder = landmarks[POSE_LANDMARK.RIGHT_SHOULDER]
  const leftHip = landmarks[POSE_LANDMARK.LEFT_HIP]
  const rightHip = landmarks[POSE_LANDMARK.RIGHT_HIP]

  const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2
  const hipMidX = (leftHip.x + rightHip.x) / 2

  return {
    shoulderTiltDeg: tiltDeg(leftShoulder, rightShoulder),
    hipTiltDeg: tiltDeg(leftHip, rightHip),
    shoulderOffsetX: shoulderMidX - nose.x,
    hipOffsetX: hipMidX - nose.x,
  }
}

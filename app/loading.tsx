"use client"
import Image from "next/image"
import styled, { keyframes } from "styled-components"

const spin = keyframes`
from {
  transform: rotate(0deg);
}
to {
  transform: rotate(360deg);
}
`

const Spinner = styled.div`
  animation: ${spin} 1s linear infinite;
`

const LoadingViewContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

export default function Loading() {
  return (
    <LoadingViewContainer>
      <Spinner>
        <Image src="/hockey-stick.png" alt="Loading" width={200} height={200} />
      </Spinner>
    </LoadingViewContainer>
  )
}

import React from "react"

type QRCodeProps = {
  url: string
  size?: number
  alt?: string
  className?: string
}

export default function QRCode({ url, size = 300, alt = "QR code", className = "" }: QRCodeProps) {
  if (!url) return null

  const src = `https://chart.googleapis.com/chart?chs=${size}x${size}&cht=qr&chl=${encodeURIComponent(
    url
  )}`

  return <img src={src} alt={alt} width={size} height={size} className={className} />
}

import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const {
      dealId,
      artistUsername,
      artistLegalName,
      producerUsername,
      producerLegalName,
      trackTitle,
      agreedPrice,
      date,
      licenseType,
    } = await req.json()

    const isExclusive = licenseType === 'exclusive'

    const licenseText = `
BEAT ${isExclusive ? 'EXCLUSIVE RIGHTS' : 'LEASE'} AGREEMENT

Date: ${date}
License ID: ${dealId}
License Type: ${isExclusive ? 'EXCLUSIVE RIGHTS TRANSFER' : 'NON-EXCLUSIVE LEASE'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PARTIES

Licensor (Producer)
  Artist name: ${producerUsername}
  Legal name: ${producerLegalName}

Licensee (Artist)
  Artist name: ${artistUsername}
  Legal name: ${artistLegalName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRACK

  Title: ${trackTitle}
  Purchase Price: $${agreedPrice} USD

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GRANT OF LICENSE

${isExclusive ? `EXCLUSIVE RIGHTS
The Licensor hereby transfers EXCLUSIVE rights of the beat to the Licensee.

The Licensee is granted:
- Full exclusive ownership of the beat
- Unlimited commercial releases and distribution
- Unlimited streaming and downloads
- Sync licensing for TV, film, and advertisements
- Unlimited music videos
- Unlimited live performances
- The right to re-sell or sub-license the composition

The Licensor agrees:
- To remove the beat from all marketplaces immediately
- To not license the beat to any other party after this agreement
- That the Licensee owns all rights to the final composition
` : `NON-EXCLUSIVE LEASE
The Licensor hereby grants the Licensee a non-exclusive license to use the beat.

The Licensee is granted:
- Up to 100,000 audio streams
- Up to 10,000 downloads
- Up to 1 music video
- Unlimited live performances
- Non-profit and commercial use

The Licensor retains:
- The right to license the beat to other artists
- Full ownership of the instrumental
- The right to use the beat in their own portfolio

The Licensee must:
- Credit the producer as: "Prod. by ${producerUsername}"
- Not resell or sub-license the beat
`}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PLATFORM

This agreement was facilitated by BeatPool (beatpool.com)
Transaction ID: ${dealId}

By completing payment on BeatPool, both parties agree to the
terms outlined in this license agreement.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SIGNATURES

Licensor: ${producerLegalName} (${producerUsername})
Licensee: ${artistLegalName} (${artistUsername})
Date: ${date}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim()

    return NextResponse.json({ licenseText })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
import { describe, expect, it } from 'vitest'
import { chooseWeightedAd } from '../server/services/adService'

describe('chooseWeightedAd', () => {
  it('returns null without eligible ads', () => {
    expect(chooseWeightedAd([])).toBeNull()
  })

  it('uses weights for deterministic selection', () => {
    const ads = [{ id: 'a', weight: 1 }, { id: 'b', weight: 9 }]
    expect(chooseWeightedAd(ads, () => 0.05)?.id).toBe('a')
    expect(chooseWeightedAd(ads, () => 0.5)?.id).toBe('b')
  })
})

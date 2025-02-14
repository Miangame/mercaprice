enum Unit {
  PX = 8,
  REM = 0.5
}

enum Measure {
  PX = 'px',
  REM = 'rem'
}

const withMeasure = (unit: Unit, measure: Measure) => `${unit}${measure}`

export const getSizes = (inPixels = false) => {
  const unit = inPixels ? Unit.PX : Unit.REM
  const suffix = inPixels ? Measure.PX : Measure.REM

  return {
    quarter: withMeasure(unit / 4, suffix), // 2px
    half: withMeasure(unit / 2, suffix), // 4px
    unit: withMeasure(unit, suffix), // 8px
    oneAndHalf: withMeasure(unit * 1.5, suffix), // 12px
    double: withMeasure(unit * 2, suffix), // 16px
    triple: withMeasure(unit * 3, suffix), // 24px
    quad: withMeasure(unit * 4, suffix), // 32px
    quint: withMeasure(unit * 5, suffix), // 40px
    sex: withMeasure(unit * 6, suffix), // 48px
    units: (multiplier = 1) => withMeasure(unit * multiplier, suffix)
  }
}

import React from "react";

type Name = string
type Input = string
type Output = string
type Step = [Name, Input, Output]
type SinglePointStep = [Name, Input&Output]

const pos = (sch_x: number, sch_y: number) => ({sch_x, sch_y})

function trace(steps: (Step|SinglePointStep)[]) {
  const result = []
  let current = steps.shift()
  let next = steps.shift()
  while (current !== undefined && next !== undefined) {
    result.push(<trace path={[`.${current[0]} > .${current[2] ?? current[1]}`, `.${next[0]} > .${next[1]}`]} />)
    current = next
    next = steps.shift()
  }

  return result
}

export const Buttons = () => (
  <>
    <board width="50mm" height="50mm" center_x={0} center_y={0}>
      <group>
        {/* Main power circuit, required because the power source is a signal and not a stable power supply */}
        <powersource voltage="11v" name="P1" {...pos(-4, 0)} />

        <diode name='D1' {...pos(-3, -0.75)} />

        <capacitor
          name="C1"
          capacitance="10uf"
          footprint='sparkfun:capacitors:0805'
          rotation={"90deg"}
          {...pos(-2, 0)}
        />

        <bug name={"M1"} port_arrangement={{left_size: 2, right_size: 2}} port_labels={{1: 'GND', 2: 'VCC', 3: 'VCCO', 4: 'GNDO'}} {...pos(0, 0)}/>
        
        {/* Positive track */}
        {trace([
          ['P1', '', 'positive'],
          ['D1', 'left', 'right'],
          ['C1', 'left', 'left'],
          ['M1', 'VCC', 'VCCO'],
        ])}

        {/* Negative track */}
        {trace([
          ['P1', '', 'negative'],
          ['C1', 'right', 'right'],
          ['M1', 'GND', 'GNDO'],
        ])}

        {/* 3.3v voltage divider */}

        <capacitor
          name="C2"
          capacitance="10uf"
          footprint='sparkfun:capacitors:0805'
          {...pos(2, 0)}
          rotation={"90deg"}
        />

        <resistor name="R1" resistance="10000" rotation={"90deg"} {...pos(3, -1)} />
        <resistor name="R2" resistance="20000" rotation={"-90deg"} {...pos(3, 1)} />

        {trace([
          ['M1', 'VCCO'],
          ['C2', 'left', 'left'],
          ['R1', 'left', 'right'],
          ['R2', 'right', 'left'],
          ['C2', 'right', 'right'],
          ['M1', 'GNDO']
        ])}

        {/* Logic circuit */}

        <bug name={"M2"} port_arrangement={{left_size: 8}} port_labels={{
          1: "CHPD",
          2: "GPIO2",
          3: "GPIO0",
          4: "VRX0",
          5: "UTXD",
          6: "GPIO16",
          7: "GND",
          8: "VCC",
        }} {...pos(5, 1.5)} />

        <bug name={"T1"} port_arrangement={{left_size: 2, right_size: 1}} port_labels={{
          1: "emitter",
          2: "collector",
          3: "base",
        }} {...pos(2, 2.5)} />

        <led name="DOOR" x={0} y={2.5} rotation={"-90deg"}/>

        {trace([
          ['R2', 'right'],
          ['M2', 'VCC', 'GND'],
          ['R2', 'left', 'left'],
        ])}
        {trace([
          ['M2', 'GPIO2'],
          ['T1', 'base', 'emitter'],
          ['DOOR', 'left', 'right'],
          ['T1', 'collector']
        ])}
      </group>
    </board>
  </>
)
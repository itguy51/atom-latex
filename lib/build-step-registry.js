/** @babel */

import fs from 'fs-plus'
import path from 'path'

export default class BuildStepRegistry {
  steps = []

  constructor () {
    this.initialize()
  }

  initialize () {
    const moduleDir = path.join(__dirname, 'steps')
    const entries = fs.readdirSync(moduleDir)
    this.steps = entries.map(entry => {
      const StepImpl = require(path.join(moduleDir, entry))
      return new StepImpl()
    })
  }

  async run (state, jobname) {
    for (const name of names) {
      const step = this.getStep(name)
      await step.run(state, jobname)
    }
  }
}

/** @babel */

import BuildStep from '../build-step'
import LogParser from './parsers/log-parser'

export default class MagicParseStep extends BuildStep {
  async run (state, jobname) {
    const jobState = state.jobStates.get(jobname)
    const result = this.getLog(state, jobname)

    if (result) {
      if (result.outputFilePath) {
        jobState.filePaths.add(result.outputFilePath)
      }
      for (const message of result.messages) {
        latex.log.showMessage(message)
      }
    }
  }

  getLog (state, jobname) {
    const logFilePath = state.resolveOutputFilePath(jobname, '.log')
    return new LogParser(logFilePath, state.rootFilePath).parse()
  }
}

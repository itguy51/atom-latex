/** @babel */

export default class BuildStep {
  canProcess (state, ext) { return false }
  async run (state, jobname) {}
}

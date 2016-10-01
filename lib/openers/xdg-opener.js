/** @babel */

import Opener from '../opener'

export default class XdgOpener extends Opener {
  // xdg-open does not support texPath and lineNumber.
  async open (filePath, texPath, lineNumber) {
    const command = `xdg-open "${filePath}"`

    return this.executeChildProcess(command)
  }
}
/** @babel */

import childProcess from 'child_process'
import kill from 'tree-kill'
import path from 'path'
import _ from 'lodash'

export default class ProcessManager {
  processes = new Set()

  executeChildProcess (command, options = {}) {
    const { allowKill, showError } = options
    options = _.omit(options, 'allowKill', 'showError')
    return new Promise((resolve) => {
      // Windows does not like \$ appearing in command lines so only escape
      // if we need to.
      if (process.platform !== 'win32') command = command.replace('$', '\\$')
      const { pid } = childProcess.exec(command, options, (error, stdout, stderr) => {
        if (allowKill) {
          this.processes.delete(pid)
        }
        if (error && showError) {
          latex.log.error(`An error occured while trying to run "${command}" (${error.code}).`)
        }
        resolve({
          statusCode: error ? error.code : 0,
          stdout,
          stderr
        })
      })
      if (allowKill) {
        this.processes.add(pid)
      }
    })
  }

  killChildProcesses () {
    for (const pid of this.processes.values()) {
      kill(pid)
    }
    this.processes.clear()
  }

  constructChildProcessOptions (workingDirectory, defaultEnv) {
    const env = _.assign(defaultEnv || {}, process.env)
    const childPath = this.constructPath()
    if (childPath) {
      env[this.envPathKey] = childPath
    }

    return {
      allowKill: true,
      encoding: 'utf8',
      maxBuffer: 52428800, // Set process' max buffer size to 50 MB.
      cwd: workingDirectory, // Run process with sensible CWD.
      env
    }
  }

  constructPath () {
    let texPath = (atom.config.get('latex.texPath') || '').trim()
    if (texPath.length === 0) {
      texPath = this.defaultTexPath(process.platform)
    }

    const processPath = process.env[this.envPathKey]
    const match = texPath.match(/^(.*)(\$PATH)(.*)$/)
    if (match) {
      return `${match[1]}${processPath}${match[3]}`
    }

    return [texPath, processPath]
      .filter(str => str && str.length > 0)
      .join(path.delimiter)
  }

  defaultTexPath (platform) {
    if (platform === 'win32') {
      return [
        '%SystemDrive%\\texlive\\2016\\bin\\win32',
        '%SystemDrive%\\texlive\\2015\\bin\\win32',
        '%SystemDrive%\\texlive\\2014\\bin\\win32',
        '%ProgramFiles%\\MiKTeX 2.9\\miktex\\bin\\x64',
        '%ProgramFiles(x86)%\\MiKTeX 2.9\\miktex\\bin'
      ].join(';')
    }

    return [
      '/usr/texbin',
      '/Library/TeX/texbin'
    ].join(':')
  }
}

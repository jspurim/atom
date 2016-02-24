'use babel'

import {Emitter, CompositeDisposable} from 'event-kit'
import {ipcRenderer} from 'electron'

export default class AutoUpdateManager {
  constructor () {
    this.subscriptions = new CompositeDisposable()
    this.emitter = new Emitter()
  }

  initialize () {
    this.subscriptions.add(
      atom.applicationDelegate.onDidBeginDownloadingUpdate(() => {
        this.emitter.emit('did-begin-downloading-update')
      }),
      atom.applicationDelegate.onDidBeginCheckingForUpdate(() => {
        this.emitter.emit('did-begin-checking-for-update')
      }),
      atom.applicationDelegate.onDidCompleteDownloadingUpdate(() => {
        this.emitter.emit('did-complete-downloading-update')
      }),
      atom.applicationDelegate.onUpdateNotAvailable(() => {
        this.emitter.emit('update-not-available')
      })
    )
  }

  dispose () {
    this.subscriptions.dispose()
  }

  onDidBeginCheckingForUpdate (callback) {
    this.subscriptions.add(
      this.emitter.on('did-begin-checking-for-update', callback)
    )
  }

  onDidBeginDownload (callback) {
    this.subscriptions.add(
      this.emitter.on('did-begin-downloading-update', callback)
    )
  }

  onDidCompleteDownload (callback) {
    this.subscriptions.add(
      this.emitter.on('did-complete-downloading-update', callback)
    )
  }

  onUpdateAvailable (callback) {
    this.subscriptions.add(
      this.emitter.on('update-available', callback)
    )
  }

  onUpdateNotAvailable (callback) {
    this.subscriptions.add(
      this.emitter.on('update-not-available', callback)
    )
  }

  check () {
    ipcRenderer.send('check-for-update')
  }
}
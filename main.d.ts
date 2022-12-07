type Formatter = {
  id: string;
  name: string;
  exts: Array<string>;
  format(): Promise<void>;
};

type CancelOption = {
  timeout: number;
  callback(): void;
};

type Loader = {
  setTitle(title: string): void;
  setMessage(message: string): void;
  hide(): void;
  show(): void;
  destroy(): void;
};

type PromptOptions = {
  match: RegExp;
  required: boolean;
  placeholder: string;
  test(value: any): boolean;
};

type SelectOptions = {
  onCancel(): void;
  hideOnSelect: boolean;
  textTransform: boolean;
  default: any;
};
interface Acode {
  readonly exitAppMessage: string;
  readonly formatters: Array<Formatter>;
  exec(command: string, value?: any): boolean;
  setLoadingMessage(message: string): void;
  initPlugin(pluginId: string, baseUrl: string, $page: HTMLElement): void;
  unmountPlugin(pluginId: string): void;
  registerFormatter(
    id: string,
    extensions: Array<string>,
    format: () => Promise<void>,
  ): void;
  unregisterFormatter(id: string): void;
  fsOperation(file: string): FileSystem;
  newEditorFile(filename: string, options: object): object;
  alert(title: string, message: string, onhide: () => void): void;
  loader(title: string, message: string, options: CancelOption): Loader;
  prompt(
    message: string,
    defaultValue: string | number | boolean,
    type: string,
    options: PromptOptions,
  ): Promise<string | number | boolean>;
  confirm(title: string, message: string): Promise<boolean>;
  select(
    title: string,
    options: Array<[value: string, text: string, icon: string] | string>,
    config: SelectOptions,
  ): Promise<string>;
  multiPrompt(
    title: string,
    inputs: Array<Input>,
    help: string,
  ): Promise<Map<string, string | number>>;
  fileBrowser(
    mode: 'file' | 'folder',
    info: string,
    openLast: boolean,
  ): Promise<FileBrowserResponse>;
  toInternalUrl(url: string): Promise<string>;
  $menuToggler: HTMLElement;
  $editMenuToggler: HTMLElement;
  pluginServer: Server;
  webServer: Server;
  $quickToolToggler: HTMLElement;
  $headerToggler: HTMLElement;
}

interface fileBrowserSettings {
  showHiddenFiles: 'on' | 'off';
  sortByName: 'on' | 'off';
}

interface searchSettings {
  wrap: boolean;
  caseSensitive: boolean;
  regExp: boolean;
  wholeWord: boolean;
}

interface Settings {
  animation: 'system' | boolean;
  autosave: number;
  fileBrowser: fileBrowserSettings;
  maxFileSize: number;
  filesNotAllowed: string[];
  formatter: Map<string, string>;
  search: searchSettings;
  lang: string;
  fontSize: string;
  editorTheme: string;
  appTheme: string;
  textWrap: boolean;
  softTab: boolean;
  tabSize: number;
  linenumbers: boolean;
  formatOnSave: boolean;
  linting: boolean;
  previewMode: 'browser' | 'inapp';
  showSpaces: boolean;
  openFileListPos: 'sidebar' | 'header';
  quickTools: boolean;
  editorFont: string;
  vibrateOnTap: boolean;
  fullscreen: boolean;
  smartCompletion: boolean;
  floatingButton: boolean;
  liveAutoCompletion: boolean;
  showPrintMargin: boolean;
  scrollbarSize: number;
  confirmOnExit: boolean;
  customTheme: Map<string, string>;
  customThemeMode: 'light' | 'dark';
  lineHeight: number;
  leftMargin: number;
  checkFiles: boolean;
  desktopMode: boolean;
  console: 'legacy' | 'eruda';
  keyboardMode: 'CODE' | 'NORMAL';
  keyboardMode: 'NO_SUGGESTIONS' | 'NO_SUGGESTIONS_AGGRESSIVE' | 'NORMAL';
  showAd: boolean;
  disableCache: boolean;
  diagonalScrolling: boolean;
  reverseScrolling: boolean;
  teardropTimeout: number;
  teardropSize: 20 | 40 | 60;
  scrollSpeed: number;
}

interface AppSettings {
  value: Settings;
  update(settings?: Settings, showToast?: boolean): Promise<void>;
  update(showToast?: boolean): Promise<void>;
  defaultSettings: Settings;
  reset(): Promise<void>;
  onload: () => void;
  onsave: () => void;
  loaded: boolean;
  isFileAllowed(ext: string): boolean;
  on(
    eventName: 'reset' | 'update',
    callback: (this: Settings, settings: Settings | string) => void,
  ): void;
  off(
    eventName: 'reset' | 'update',
    callback: (this: Settings, settings: Settings | string) => void,
  ): void;
  applyAutoSaveSetting(): void;
  applyAnimationSetting(): void;
  applyLangSetting(): void;
}

interface ActionStackOptions {
  id: string;
  action(): void;
}

interface ActionStack {
  push(options: ActionStackOptions): void;
  pop(): ActionStack;
  remove(id: string): void;
  has(id: string): boolean;
  length: number;
  /**
   * Sets a mark to recently pushed action
   */
  setMark(): void;
  /**
   * Remove all actions that are pushed after marked positions (using `setMark()`)
   */
  clearFromMark(): void;
  /**
   * Callback function when app is to close
   */
  onCloseApp: () => void;
}

interface Fold {
  range: AceAjax.Range;
  ranges: Array<Fold>;
  placeholder: string;
}

interface FileStatus {
  canRead: boolean;
  canWrite: boolean;
  exists: boolean; //indicates if file can be found on device storage
  isDirectory: boolean;
  isFile: boolean;
  isVirtual: boolean;
  lastModified: number;
  length: number;
  name: string;
  type: string;
  uri: string;
}

interface OriginObject {
  origin: string;
  query: string;
}

interface URLObject {
  url: string;
  query: string;
}

interface fileData {
  file: FileEntry;
  data: ArrayBuffer;
}

interface ExternalFs {
  readFile(): Promise<fileData>;
  createFile(
    parent: string,
    filename: string,
    data: string,
  ): Promise<'SUCCESS'>;
  createDir(parent: string, path: string): Promise<'SUCCESS'>;
  delete(filename: string): Promise<'SUCCESS'>;
  writeFile(filename: string, content: string): Promise<'SUCCESS'>;
  renameFile(src: string, newname: string): Promise<'SUCCESS'>;
  copy(src: string, dest: string): Promise<'SUCCESS'>;
  move(src: string, dest: string): Promise<'SUCCESS'>;
  stats(src: string): Promise<FileStatus>;
  uuid: string;
}

interface RemoteFs {
  listDir(path: string): Promise<Array<FsEntry>>;
  readFile(path: string): Promise<ArrayBuffer | string>;
  createFile(filename: string, data: string): Promise<string>;
  createDir(path: string): Promise<string>;
  delete(name: string): Promise<string>;
  writeFile(filename: string, content: string): Promise<string>;
  rename(src: string, newname: string): Promise<string>;
  copyTo(src: string, dest: string): Promise<string>;
  currentDirectory(): Promise<string>;
  homeDirectory(): Promise<string>;
  stats(src: string): Promise<FileStatus>;
  /**
   * Resolve with true if file exists else resolve if false. Rejects if any error is generated.
   */
  exists(): Promise<boolean>;
  origin: string;
  originObjec: OriginObject;
}

interface InternalFs {
  copyTo(dest: string): Promise<string>;
  moveTo(dest: string): Promise<string>;
  listDir(path: string): Promise<Entry[]>;
  createDir(parent: string, dirname: string): Promise<void>;
  delete(filename: string): Promise<void>;
  readFile(filename: string): Promise<fileData>;
  writeFile(
    filename: string,
    content: string,
    create: boolean,
    exclusive: boolean,
  ): Promise<void>;
  renameFile(src: string, newname: string): Promise<void>;
  stats(src: string): Promise<FileStatus>;
  exists(): Promise<boolean>;
}

interface FsEntry {
  url: string;
  isDirectory: boolean;
  isFile: boolean;
}

interface FileSystem {
  lsDir(): Promise<Array<FsEntry>>;
  readFile(): Promise<ArrayBuffer>;
  readFile(encoding: string): Promise<string>;
  writeFile(content: string): Promise<void>;
  createFile(name: string, data: string): Promise<void>;
  createDirectory(name: string): Promise<void>;
  delete(): Promise<void>;
  copyTo(dest: string): Promise<string>;
  moveTo(dset: string): Promise<string>;
  renameTo(newName: string): Promise<void>;
  exists(): Promise<boolean>;
  stat(): Promise<FileStatus>;
}

interface externalStorageData {
  path: string;
  name: string;
  origin: string;
}

interface elementContainer {
  [key: string]: HTMLElement;
}

interface GistFile {
  filename: string;
  content: string;
}

interface GistFiles {
  [filename: string]: GistFile;
}

interface Repository {}

interface Repo {
  readonly sha: string;
  name: string;
  data: string;
  repo: string;
  path: string;
  branch: 'master' | 'main' | string;
  commitMessage: string;
  setName(name: string): Promise<void>;
  setData(data: string): Promise<void>;
  repository: Repository;
}

interface Gist {
  readonly id: string;
  readonly isNew: boolean;
  files: GistFiles;
  setName(name: string, newName: string): Promise<void>;
  setData(name: string, text: string): Promise<void>;
  addFile(name: string): void;
  removeFile(name: string): Promise<void>;
}

interface GitRecord {
  get(sha: string): Promise<Repo>;
  add(gitFileRecord: Repo): void;
  remove(sha: string): Repo;
  update(sha: string, gitFileRecord: Repo): void;
}

interface GistRecord {
  get(id: string): Gist;
  add(gist: any, isNew?: boolean): void;
  remove(gist: Gist): Gist;
  update(gist: Gist): void;
  reset(): void;
}

interface Window {
  restoreTheme(): void;
}

interface Input {
  id: string;
  type:
    | 'text'
    | 'numberic'
    | 'tel'
    | 'search'
    | 'email'
    | 'url'
    | 'checkbox'
    | 'radio'
    | 'group'
    | 'button';
  match: RegExp;
  value: string;
  name: string;
  required: boolean;
  hints(options: Array<string>): void;
  placeholder: string;
  disabled: boolean;
  onclick(this: HTMLElement): void;
}

interface String {
  /**
   * Capitalize the string for e.g. converts "this is a string" to "This Is A string"
   */
  capitalize(): string;
  /**
   * Capitalize a character at given index for e.g.
   * ```js
   * "this is a string".capitalize(0) //"This is a string"
   * ```
   */
  capitalize(index: number): string;
  /**
   * Returns hashcode of the string
   */
  hashCode(): string;
  /**
   * Subtract the string passed in argument from the given string,
   * For e.g. ```"myname".subtract("my") //"name"```
   */
  subtract(str: string): string;
}

/**
 * Returns fully decoded url
 * @param url
 */
declare function decodeURL(url: string): string;

/**
 * App settings
 */
declare var appSettings: AppSettings;
/**
 * Predefined strings for language support
 */
declare var strings: Map<string, string>;
/**
 * Handles back button click
 */
declare var acode: Acode;

declare var ASSETS_DIRECTORY: string;
declare var CACHE_STORAGE: string;
declare var DATA_STORAGE: string;
declare var PLUGIN_DIR: string;
declare var DOES_SUPPORT_THEME: boolean;
declare var IS_FREE_VERSION: boolean;
declare var KEYBINDING_FILE: string;
declare var ANDROID_SDK_INT: number;

declare var ace: AceAjax.Ace;
declare var app: HTMLBodyElement;
declare var root: HTMLElement;
declare var freeze: boolean;
declare var saveTimeout: number;
declare var actionStack: ActionStack;
declare var addedFolder: Array<Folder>;
declare var gitRecord: GitRecord;
declare var gistRecord: GistRecord;
declare var gitRecordFile: string;
declare var gistRecordFile: string;
declare var toastQueue: Array<HTMLElement>;
declare var toast: (message: string) => void;

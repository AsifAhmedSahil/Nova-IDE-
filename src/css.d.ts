declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "@xterm/xterm/css/xterm.css" {
  const content: any;
  export default content;
}

declare module "allotment/dist/style.css" {
  const content: any;
  export default content;
}

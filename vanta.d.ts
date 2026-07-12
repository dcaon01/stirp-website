// Vanta's dist bundles ship no type declarations. We import them only for
// their side effect (registering the effect on window.VANTA), then read the
// factory from window.VANTA[NAME].
declare module "vanta/dist/vanta.net.min";
declare module "vanta/dist/vanta.topology.min";

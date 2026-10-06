import "mapbox-gl";

declare module "mapbox-gl" {
    export let workerClass: new () => Worker;
}

import "@awesome.me/webawesome/dist/components/animated-image/animated-image";
import "@awesome.me/webawesome/dist/components/animation/animation";
import "@awesome.me/webawesome/dist/components/avatar/avatar";
import "@awesome.me/webawesome/dist/components/badge/badge";
import "@awesome.me/webawesome/dist/components/breadcrumb/breadcrumb";
import "@awesome.me/webawesome/dist/components/breadcrumb-item/breadcrumb-item";
import "@awesome.me/webawesome/dist/components/button/button";
import "@awesome.me/webawesome/dist/components/button-group/button-group";
import "@awesome.me/webawesome/dist/components/callout/callout";
import "@awesome.me/webawesome/dist/components/card/card";
import "@awesome.me/webawesome/dist/components/carousel/carousel";
import "@awesome.me/webawesome/dist/components/carousel-item/carousel-item";
import "@awesome.me/webawesome/dist/components/checkbox/checkbox";
import "@awesome.me/webawesome/dist/components/color-picker/color-picker";
import "@awesome.me/webawesome/dist/components/comparison/comparison";
import "@awesome.me/webawesome/dist/components/copy-button/copy-button";
import "@awesome.me/webawesome/dist/components/details/details";
import "@awesome.me/webawesome/dist/components/dialog/dialog";
import "@awesome.me/webawesome/dist/components/divider/divider";
import "@awesome.me/webawesome/dist/components/drawer/drawer";
import "@awesome.me/webawesome/dist/components/dropdown/dropdown";
import "@awesome.me/webawesome/dist/components/dropdown-item/dropdown-item";
import "@awesome.me/webawesome/dist/components/format-bytes/format-bytes";
import "@awesome.me/webawesome/dist/components/format-date/format-date";
import "@awesome.me/webawesome/dist/components/format-number/format-number";
import "@awesome.me/webawesome/dist/components/icon/icon";
import "@awesome.me/webawesome/dist/components/include/include";
import "@awesome.me/webawesome/dist/components/input/input";
import "@awesome.me/webawesome/dist/components/intersection-observer/intersection-observer";
import "@awesome.me/webawesome/dist/components/mutation-observer/mutation-observer";
import "@awesome.me/webawesome/dist/components/option/option";
import "@awesome.me/webawesome/dist/components/popover/popover";
import "@awesome.me/webawesome/dist/components/popup/popup";
import "@awesome.me/webawesome/dist/components/progress-bar/progress-bar";
import "@awesome.me/webawesome/dist/components/progress-ring/progress-ring";
import "@awesome.me/webawesome/dist/components/qr-code/qr-code";
import "@awesome.me/webawesome/dist/components/radio/radio";
import "@awesome.me/webawesome/dist/components/radio-group/radio-group";
import "@awesome.me/webawesome/dist/components/rating/rating";
import "@awesome.me/webawesome/dist/components/relative-time/relative-time";
import "@awesome.me/webawesome/dist/components/resize-observer/resize-observer";
import "@awesome.me/webawesome/dist/components/scroller/scroller";
import "@awesome.me/webawesome/dist/components/select/select";
import "@awesome.me/webawesome/dist/components/skeleton/skeleton";
import "@awesome.me/webawesome/dist/components/slider/slider";
import "@awesome.me/webawesome/dist/components/spinner/spinner";
import "@awesome.me/webawesome/dist/components/split-panel/split-panel";
import "@awesome.me/webawesome/dist/components/switch/switch";
import "@awesome.me/webawesome/dist/components/tab/tab";
import "@awesome.me/webawesome/dist/components/tab-group/tab-group";
import "@awesome.me/webawesome/dist/components/tab-panel/tab-panel";
import "@awesome.me/webawesome/dist/components/tag/tag";
import "@awesome.me/webawesome/dist/components/textarea/textarea";
import "@awesome.me/webawesome/dist/components/tooltip/tooltip";
import "@awesome.me/webawesome/dist/components/tree/tree";
import "@awesome.me/webawesome/dist/components/tree-item/tree-item";
import "@awesome.me/webawesome/dist/components/zoomable-frame/zoomable-frame";
import "@awesome.me/webawesome/dist/styles/color/palettes/bright.css";
import "@awesome.me/webawesome/dist/styles/color/palettes/shoelace.css";
import "@awesome.me/webawesome/dist/styles/themes/awesome.css";
import "@awesome.me/webawesome/dist/styles/webawesome.css";
import "solid-js";

import type {
  CustomCssProperties,
  CustomElements,
} from "@awesome.me/webawesome/dist/custom-elements-jsx.d.ts";
import type { JSX } from "solid-js";

type WithEventHandlers<T> = T & JSX.HTMLAttributes<HTMLElement>;

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements
      extends Record<
        keyof CustomElements,
        WithEventHandlers<CustomElements[keyof CustomElements]>
      > {}
  }
  export interface CSSProperties extends CustomCssProperties {}
}

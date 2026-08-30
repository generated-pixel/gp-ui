/**
 * Design Token Type Definitions for gp-ui
 * Structured across Primitives, Semantic, and Component token layers.
 */

export type DeepPartial<T> = T extends Function
  ? T
  : T extends Array<infer U>
    ? _DeepPartialArray<U>
    : T extends object
      ? _DeepPartialObject<T>
      : T | undefined;

type _DeepPartialArray<T> = Array<DeepPartial<T>>;
type _DeepPartialObject<T> = { [P in keyof T]?: DeepPartial<T[P]> };

export type GpColorScheme = 'light' | 'dark' | 'system';
export type GpThemeMode = GpColorScheme | 'gp-light' | 'gp-dark';

export interface GpThemeMeta {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  lightSurface: string;
  darkSurface: string;
}

export interface GpThemeState {
  theme: string;
  mode: GpThemeMode;
  activeMode: 'light' | 'dark';
  isDark: boolean;
}

export interface GpThemeTokens {
  primaryColor?: string;
  primaryHover?: string;
  primaryActive?: string;
  borderRadius?: string;
  fontSize?: string;
  fontFamily?: string;
  surfaceGround?: string;
  surfaceCard?: string;
  textColor?: string;
}

/**
 * 1. Primitive Tokens Layer
 * Raw, context-agnostic design values (color ramps, spacing scales, typography scales, etc.)
 */
export interface GpColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface GpPrimitiveColors {
  indigo: GpColorScale;
  slate: GpColorScale;
  cyan: GpColorScale;
  teal: GpColorScale;
  emerald: GpColorScale;
  amber: GpColorScale;
  orange: GpColorScale;
  violet: GpColorScale;
  rose: GpColorScale;
  nord: GpColorScale;
  cyberpunk: GpColorScale;
  gray: GpColorScale;
  white: string;
  black: string;
  transparent: string;
  [key: string]: GpColorScale | string;
}

export interface GpPrimitiveTypography {
  fontFamily: {
    sans: string;
    mono: string;
    heading: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    light: string | number;
    normal: string | number;
    medium: string | number;
    semibold: string | number;
    bold: string | number;
    extrabold: string | number;
  };
  lineHeight: {
    none: string;
    tight: string;
    snug: string;
    normal: string;
    relaxed: string;
    loose: string;
  };
}

export interface GpPrimitiveSpacing {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  8: string;
  10: string;
  12: string;
  16: string;
  20: string;
  24: string;
  32: string;
}

export interface GpPrimitiveBorderRadius {
  none: string;
  xs: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface GpPrimitiveShadows {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
}

export interface GpPrimitiveTransitions {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  timing: {
    ease: string;
    linear: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
}

export interface GpPrimitives {
  colors: GpPrimitiveColors;
  typography: GpPrimitiveTypography;
  spacing: GpPrimitiveSpacing;
  borderRadius: GpPrimitiveBorderRadius;
  shadows: GpPrimitiveShadows;
  transitions: GpPrimitiveTransitions;
}

/**
 * 2. Semantic Tokens Layer
 * Contextual design tokens with specific intent (primary, status, surfaces, text, focus)
 */
export interface GpSemanticColorToken {
  main: string;
  text: string;
  hover: string;
  active: string;
  light: string;
  border?: string;
}

export interface GpSemanticSurfaces {
  ground: string;
  section: string;
  card: string;
  overlay: string;
  hover: string;
  active: string;
  border: string;
  divider: string;
}

export interface GpSemanticText {
  primary: string;
  secondary: string;
  muted: string;
  disabled: string;
}

export interface GpSemanticFocus {
  ring: string;
  ringDanger: string;
}

export interface GpSemanticElevation {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface GpSemanticTokens {
  primaryScale: GpColorScale;
  primary: GpSemanticColorToken;
  secondary: GpSemanticColorToken;
  success: GpSemanticColorToken;
  info: GpSemanticColorToken;
  warning: GpSemanticColorToken;
  danger: GpSemanticColorToken;
  contrast: {
    main: string;
    text: string;
    hover: string;
  };
  surfaces: GpSemanticSurfaces;
  text: GpSemanticText;
  focus: GpSemanticFocus;
  shadows: GpSemanticElevation;
  mask: {
    bg: string;
  };
}

/**
 * 3. Component Tokens Layer
 * Component-specific styling definitions
 */
export interface GpButtonComponentTokens {
  height?: string;
  paddingX?: string;
  paddingY?: string;
  borderRadius?: string;
  fontWeight?: string | number;
  [key: string]: any;
}

export interface GpInputComponentTokens {
  bg?: string;
  border?: string;
  borderHover?: string;
  borderFocus?: string;
  paddingX?: string;
  paddingY?: string;
  height?: string;
  borderRadius?: string;
  [key: string]: any;
}

export interface GpCardComponentTokens {
  bg?: string;
  border?: string;
  borderRadius?: string;
  shadow?: string;
  [key: string]: any;
}

export interface GpTooltipComponentTokens {
  bg?: string;
  text?: string;
  fontSize?: string;
  borderRadius?: string;
  paddingX?: string;
  paddingY?: string;
  shadow?: string;
  [key: string]: any;
}

export interface GpAutocompleteComponentTokens {
  background?: string;
  borderColor?: string;
  borderRadius?: string;
  dropdown?: {
    width?: string;
    background?: string;
    borderColor?: string;
    color?: string;
    hoverBackground?: string;
  };
  overlay?: {
    background?: string;
    borderColor?: string;
    shadow?: string;
  };
  item?: {
    padding?: string;
    borderRadius?: string;
    focusBackground?: string;
    focusColor?: string;
    selectedBackground?: string;
    selectedColor?: string;
  };
  [key: string]: any;
}

export interface GpSelectComponentTokens {
  background?: string;
  borderColor?: string;
  borderHover?: string;
  borderFocus?: string;
  borderRadius?: string;
  placeholderColor?: string;
  overlay?: {
    background?: string;
    borderColor?: string;
    shadow?: string;
  };
  item?: {
    padding?: string;
    focusBackground?: string;
    selectedBackground?: string;
  };
  [key: string]: any;
}

export interface GpDialogComponentTokens {
  background?: string;
  borderColor?: string;
  borderRadius?: string;
  shadow?: string;
  header?: {
    padding?: string;
    fontSize?: string;
    fontWeight?: string | number;
  };
  content?: {
    padding?: string;
  };
  footer?: {
    padding?: string;
  };
  [key: string]: any;
}

export interface GpTableComponentTokens {
  background?: string;
  borderColor?: string;
  header?: {
    background?: string;
    color?: string;
    padding?: string;
    fontWeight?: string | number;
  };
  row?: {
    hoverBackground?: string;
    stripedBackground?: string;
    selectedBackground?: string;
  };
  cell?: {
    padding?: string;
  };
  [key: string]: any;
}

export interface GpToastComponentTokens {
  borderRadius?: string;
  shadow?: string;
  padding?: string;
  [key: string]: any;
}

export interface GpGenericComponentTokens {
  background?: string;
  color?: string;
  borderColor?: string;
  borderRadius?: string;
  padding?: string;
  fontSize?: string;
  shadow?: string;
  [key: string]: any;
}

export interface GpInputNumberComponentTokens extends GpGenericComponentTokens {
  buttonBackground?: string;
  buttonWidth?: string;
  horizontalButtonWidth?: string;
}

export interface GpDatePickerComponentTokens extends GpGenericComponentTokens {
  triggerColor?: string;
  panelBackground?: string;
  panelBorderColor?: string;
  panelShadow?: string;
  dayHoverBackground?: string;
  selectedBackground?: string;
  selectedColor?: string;
}

export interface GpButtonGroupComponentTokens extends GpGenericComponentTokens {}
export interface GpSplitButtonComponentTokens extends GpGenericComponentTokens {}
export interface GpSpeedDialComponentTokens extends GpGenericComponentTokens {}
export interface GpToggleButtonComponentTokens extends GpGenericComponentTokens {}
export interface GpCascadeSelectComponentTokens extends GpGenericComponentTokens {}
export interface GpCheckboxComponentTokens extends GpGenericComponentTokens {}
export interface GpColorPickerComponentTokens extends GpGenericComponentTokens {}
export interface GpFileUploadComponentTokens extends GpGenericComponentTokens {}
export interface GpInputMaskComponentTokens extends GpGenericComponentTokens {}
export interface GpListboxComponentTokens extends GpGenericComponentTokens {}
export interface GpMultiSelectComponentTokens extends GpGenericComponentTokens {}
export interface GpPasswordComponentTokens extends GpGenericComponentTokens {}
export interface GpRadioButtonComponentTokens extends GpGenericComponentTokens {}
export interface GpRatingComponentTokens extends GpGenericComponentTokens {}
export interface GpSliderComponentTokens extends GpGenericComponentTokens {}
export interface GpSwitchComponentTokens extends GpGenericComponentTokens {}
export interface GpTextareaComponentTokens extends GpGenericComponentTokens {}
export interface GpTimePickerComponentTokens extends GpGenericComponentTokens {}
export interface GpTreeSelectComponentTokens extends GpGenericComponentTokens {}
export interface GpColumnComponentTokens extends GpGenericComponentTokens {}
export interface GpDataViewComponentTokens extends GpGenericComponentTokens {}
export interface GpPaginatorComponentTokens extends GpGenericComponentTokens {}
export interface GpTreeTableComponentTokens extends GpGenericComponentTokens {}
export interface GpVirtualScrollerComponentTokens extends GpGenericComponentTokens {}
export interface GpConfirmDialogComponentTokens extends GpGenericComponentTokens {}
export interface GpDrawerComponentTokens extends GpGenericComponentTokens {}
export interface GpPopoverComponentTokens extends GpGenericComponentTokens {}
export interface GpBreadcrumbComponentTokens extends GpGenericComponentTokens {}
export interface GpContextMenuComponentTokens extends GpGenericComponentTokens {}
export interface GpDockComponentTokens extends GpGenericComponentTokens {}
export interface GpMegaMenuComponentTokens extends GpGenericComponentTokens {}
export interface GpMenuComponentTokens extends GpGenericComponentTokens {}
export interface GpMenubarComponentTokens extends GpGenericComponentTokens {}
export interface GpPanelMenuComponentTokens extends GpGenericComponentTokens {}
export interface GpStepperComponentTokens extends GpGenericComponentTokens {}
export interface GpTabsComponentTokens extends GpGenericComponentTokens {}
export interface GpTieredMenuComponentTokens extends GpGenericComponentTokens {}
export interface GpToolbarComponentTokens extends GpGenericComponentTokens {}
export interface GpAccordionComponentTokens extends GpGenericComponentTokens {}
export interface GpDividerComponentTokens extends GpGenericComponentTokens {}
export interface GpFieldsetComponentTokens extends GpGenericComponentTokens {}
export interface GpPanelComponentTokens extends GpGenericComponentTokens {}
export interface GpScrollPanelComponentTokens extends GpGenericComponentTokens {}
export interface GpSplitterComponentTokens extends GpGenericComponentTokens {}
export interface GpBadgeComponentTokens extends GpGenericComponentTokens {}
export interface GpMessageComponentTokens extends GpGenericComponentTokens {}
export interface GpProgressBarComponentTokens extends GpGenericComponentTokens {}
export interface GpProgressSpinnerComponentTokens extends GpGenericComponentTokens {}
export interface GpSkeletonComponentTokens extends GpGenericComponentTokens {}
export interface GpTagComponentTokens extends GpGenericComponentTokens {}
export interface GpOrgChartComponentTokens extends GpGenericComponentTokens {}
export interface GpTreeComponentTokens extends GpGenericComponentTokens {}
export interface GpAvatarComponentTokens extends GpGenericComponentTokens {}
export interface GpCarouselComponentTokens extends GpGenericComponentTokens {}
export interface GpChipComponentTokens extends GpGenericComponentTokens {}
export interface GpEmptyStateComponentTokens extends GpGenericComponentTokens {}
export interface GpImageComponentTokens extends GpGenericComponentTokens {}
export interface GpMeterGroupComponentTokens extends GpGenericComponentTokens {}
export interface GpTimelineComponentTokens extends GpGenericComponentTokens {}
export interface GpGridComponentTokens extends GpGenericComponentTokens {
  gap?: string;
  guideBorderColor?: string;
  placeholderBorderColor?: string;
  placeholderBackground?: string;
}

export interface GpGridWidgetComponentTokens extends GpGenericComponentTokens {
  headerBackground?: string;
  headerBorderColor?: string;
  headerPadding?: string;
  bodyPadding?: string;
  dragHandleColor?: string;
  dragHandleHoverColor?: string;
  resizeHandleColor?: string;
  lockedBorderColor?: string;
}

export interface GpBlockCardComponentTokens extends GpGenericComponentTokens {
  headerBackground?: string;
  headerBorderColor?: string;
}

export interface GpSidebarComponentTokens extends GpGenericComponentTokens {
  width?: string;
  darkBackground?: string;
  lightBackground?: string;
  borderColor?: string;
  navItemHoverBackground?: string;
  navItemActiveBackground?: string;
  navItemActiveColor?: string;
}

export interface GpKpiCardComponentTokens extends GpGenericComponentTokens {
  labelColor?: string;
  valueColor?: string;
  valueFontSize?: string;
  iconBackground?: string;
  trendPositiveColor?: string;
  trendNegativeColor?: string;
  trendNeutralColor?: string;
}

export interface GpComponentTokens {
  button?: GpButtonComponentTokens;
  buttonGroup?: GpButtonGroupComponentTokens;
  input?: GpInputComponentTokens;
  splitButton?: GpSplitButtonComponentTokens;
  speedDial?: GpSpeedDialComponentTokens;
  toggleButton?: GpToggleButtonComponentTokens;
  card?: GpCardComponentTokens;
  tooltip?: GpTooltipComponentTokens;
  autocomplete?: GpAutocompleteComponentTokens;
  cascadeSelect?: GpCascadeSelectComponentTokens;
  checkbox?: GpCheckboxComponentTokens;
  colorPicker?: GpColorPickerComponentTokens;
  datePicker?: GpDatePickerComponentTokens;
  fileUpload?: GpFileUploadComponentTokens;
  inputMask?: GpInputMaskComponentTokens;
  inputNumber?: GpInputNumberComponentTokens;
  inputText?: GpInputComponentTokens;
  listbox?: GpListboxComponentTokens;
  multiSelect?: GpMultiSelectComponentTokens;
  password?: GpPasswordComponentTokens;
  radioButton?: GpRadioButtonComponentTokens;
  rating?: GpRatingComponentTokens;
  select?: GpSelectComponentTokens;
  slider?: GpSliderComponentTokens;
  switch?: GpSwitchComponentTokens;
  textarea?: GpTextareaComponentTokens;
  timePicker?: GpTimePickerComponentTokens;
  treeSelect?: GpTreeSelectComponentTokens;
  column?: GpColumnComponentTokens;
  dataView?: GpDataViewComponentTokens;
  paginator?: GpPaginatorComponentTokens;
  table?: GpTableComponentTokens;
  treeTable?: GpTreeTableComponentTokens;
  virtualScroller?: GpVirtualScrollerComponentTokens;
  confirmDialog?: GpConfirmDialogComponentTokens;
  dialog?: GpDialogComponentTokens;
  drawer?: GpDrawerComponentTokens;
  popover?: GpPopoverComponentTokens;
  breadcrumb?: GpBreadcrumbComponentTokens;
  contextMenu?: GpContextMenuComponentTokens;
  dock?: GpDockComponentTokens;
  megaMenu?: GpMegaMenuComponentTokens;
  menu?: GpMenuComponentTokens;
  menubar?: GpMenubarComponentTokens;
  panelMenu?: GpPanelMenuComponentTokens;
  stepper?: GpStepperComponentTokens;
  tabs?: GpTabsComponentTokens;
  tieredMenu?: GpTieredMenuComponentTokens;
  toolbar?: GpToolbarComponentTokens;
  accordion?: GpAccordionComponentTokens;
  divider?: GpDividerComponentTokens;
  fieldset?: GpFieldsetComponentTokens;
  panel?: GpPanelComponentTokens;
  scrollPanel?: GpScrollPanelComponentTokens;
  splitter?: GpSplitterComponentTokens;
  badge?: GpBadgeComponentTokens;
  message?: GpMessageComponentTokens;
  progressBar?: GpProgressBarComponentTokens;
  progressSpinner?: GpProgressSpinnerComponentTokens;
  skeleton?: GpSkeletonComponentTokens;
  tag?: GpTagComponentTokens;
  toast?: GpToastComponentTokens;
  orgChart?: GpOrgChartComponentTokens;
  tree?: GpTreeComponentTokens;
  avatar?: GpAvatarComponentTokens;
  carousel?: GpCarouselComponentTokens;
  chip?: GpChipComponentTokens;
  emptyState?: GpEmptyStateComponentTokens;
  image?: GpImageComponentTokens;
  meterGroup?: GpMeterGroupComponentTokens;
  timeline?: GpTimelineComponentTokens;
  icon?: GpGenericComponentTokens;
  grid?: GpGridComponentTokens;
  gridWidget?: GpGridWidgetComponentTokens;
  blockCard?: GpBlockCardComponentTokens;
  sidebar?: GpSidebarComponentTokens;
  kpiCard?: GpKpiCardComponentTokens;
  [component: string]: GpGenericComponentTokens | undefined;
}

/**
 * Full Theme Definition Structure
 */
export interface GpThemeModeTokens {
  semantic: GpSemanticTokens;
  components?: GpComponentTokens;
}

export interface GpThemeDefinition {
  id: string;
  name: string;
  description: string;
  author?: string;
  primitives: GpPrimitives;
  light: GpThemeModeTokens;
  dark: GpThemeModeTokens;
}

export type GpThemeOverride = {
  id: string;
  name: string;
  description?: string;
  author?: string;
  primitives?: DeepPartial<GpPrimitives>;
  light?: DeepPartial<GpThemeModeTokens>;
  dark?: DeepPartial<GpThemeModeTokens>;
};

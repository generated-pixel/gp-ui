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

export interface GpPrimitiveBlur {
  sm: string;
  md: string;
  lg: string;
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
  easing?: {
    standard: string;
    emphasized: string;
    decelerate: string;
    spring: string;
  };
}

export interface GpPrimitives {
  colors: GpPrimitiveColors;
  typography: GpPrimitiveTypography;
  spacing: GpPrimitiveSpacing;
  borderRadius: GpPrimitiveBorderRadius;
  shadows: GpPrimitiveShadows;
  transitions: GpPrimitiveTransitions;
  blur?: GpPrimitiveBlur;
  fluidTypography?: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  fluidSpacing?: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
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
  glass?: string;
  glassBorder?: string;
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
  glowPrimary?: string;
  glowSecondary?: string;
}

export interface GpSemanticScrollbar {
  thumb: string;
  thumbHover: string;
  track: string;
  size: string;
  radius: string;
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
  scrollbar?: GpSemanticScrollbar;
}

/**
 * 3. Component Tokens Layer
 * Component-specific styling definitions with shared parent base interfaces
 */

export interface GpBoxSpacingTokens {
  padding?: string;
  paddingX?: string;
  paddingY?: string;
  margin?: string;
  marginX?: string;
  marginY?: string;
  gap?: string;
  spacing?: string;
}

export interface GpComponentBaseTokens extends GpBoxSpacingTokens {
  background?: string;
  color?: string;
  borderColor?: string;
  borderRadius?: string;
  fontSize?: string;
  shadow?: string;
  [key: string]: any;
}

export interface GpGenericComponentTokens extends GpComponentBaseTokens {}

export interface GpHeaderBodyFooterComponentTokens extends GpComponentBaseTokens {
  headerBackground?: string;
  headerBorderColor?: string;
  headerPadding?: string;
  headerMargin?: string;
  headerGap?: string;
  bodyPadding?: string;
  bodyMargin?: string;
  bodyGap?: string;
  footerBackground?: string;
  footerBorderColor?: string;
  footerPadding?: string;
  footerMargin?: string;
  footerGap?: string;
}

export interface GpInputComponentBaseTokens extends GpComponentBaseTokens {
  bg?: string;
  border?: string;
  borderHover?: string;
  borderFocus?: string;
  height?: string;
}

export interface GpOverlayComponentBaseTokens extends GpComponentBaseTokens {
  overlay?: {
    background?: string;
    borderColor?: string;
    shadow?: string;
    padding?: string;
    margin?: string;
  };
  item?: {
    padding?: string;
    margin?: string;
    gap?: string;
    borderRadius?: string;
    focusBackground?: string;
    focusColor?: string;
    selectedBackground?: string;
    selectedColor?: string;
  };
}

export interface GpButtonComponentTokens extends GpComponentBaseTokens {
  height?: string;
  fontWeight?: string | number;
}

export interface GpInputComponentTokens extends GpInputComponentBaseTokens {
  placeholderColor?: string;
}

export interface GpCardComponentTokens extends GpHeaderBodyFooterComponentTokens {
  bg?: string;
  border?: string;
}

export interface GpTooltipComponentTokens extends GpComponentBaseTokens {
  bg?: string;
  text?: string;
}

export interface GpAutocompleteComponentTokens extends GpOverlayComponentBaseTokens {
  dropdown?: {
    width?: string;
    background?: string;
    borderColor?: string;
    color?: string;
    hoverBackground?: string;
    padding?: string;
    margin?: string;
    gap?: string;
  };
}

export interface GpSelectComponentTokens extends GpOverlayComponentBaseTokens {
  borderHover?: string;
  borderFocus?: string;
  placeholderColor?: string;
}

export interface GpDialogComponentTokens extends GpComponentBaseTokens {
  header?: {
    padding?: string;
    margin?: string;
    gap?: string;
    fontSize?: string;
    fontWeight?: string | number;
  };
  content?: {
    padding?: string;
    margin?: string;
    gap?: string;
  };
  footer?: {
    padding?: string;
    margin?: string;
    gap?: string;
  };
}

export interface GpTableComponentTokens extends GpComponentBaseTokens {
  header?: {
    background?: string;
    color?: string;
    padding?: string;
    margin?: string;
    fontWeight?: string | number;
  };
  row?: {
    hoverBackground?: string;
    stripedBackground?: string;
    selectedBackground?: string;
  };
  cell?: {
    padding?: string;
    margin?: string;
    gap?: string;
  };
}

export interface GpToastComponentTokens extends GpComponentBaseTokens {}

export interface GpInputNumberComponentTokens extends GpComponentBaseTokens {
  buttonBackground?: string;
  buttonWidth?: string;
  horizontalButtonWidth?: string;
}

export interface GpDatePickerComponentTokens extends GpComponentBaseTokens {
  triggerColor?: string;
  panelBackground?: string;
  panelBorderColor?: string;
  panelShadow?: string;
  dayHoverBackground?: string;
  selectedBackground?: string;
  selectedColor?: string;
}

export interface GpButtonGroupComponentTokens extends GpComponentBaseTokens {}
export interface GpSplitButtonComponentTokens extends GpComponentBaseTokens {}
export interface GpSpeedDialComponentTokens extends GpComponentBaseTokens {}
export interface GpToggleButtonComponentTokens extends GpComponentBaseTokens {}
export interface GpCascadeSelectComponentTokens extends GpComponentBaseTokens {}
export interface GpCheckboxComponentTokens extends GpComponentBaseTokens {}
export interface GpColorPickerComponentTokens extends GpComponentBaseTokens {}
export interface GpFileUploadComponentTokens extends GpComponentBaseTokens {}
export interface GpInputMaskComponentTokens extends GpComponentBaseTokens {}
export interface GpListboxComponentTokens extends GpComponentBaseTokens {}
export interface GpMultiSelectComponentTokens extends GpComponentBaseTokens {}
export interface GpPasswordComponentTokens extends GpComponentBaseTokens {}
export interface GpRadioButtonComponentTokens extends GpComponentBaseTokens {}
export interface GpRatingComponentTokens extends GpComponentBaseTokens {}
export interface GpSliderComponentTokens extends GpComponentBaseTokens {}
export interface GpSwitchComponentTokens extends GpComponentBaseTokens {}
export interface GpTextareaComponentTokens extends GpComponentBaseTokens {}
export interface GpTimePickerComponentTokens extends GpComponentBaseTokens {}
export interface GpTreeSelectComponentTokens extends GpComponentBaseTokens {}
export interface GpColumnComponentTokens extends GpComponentBaseTokens {}
export interface GpDataViewComponentTokens extends GpComponentBaseTokens {}
export interface GpPaginatorComponentTokens extends GpComponentBaseTokens {}
export interface GpTreeTableComponentTokens extends GpComponentBaseTokens {}
export interface GpVirtualScrollerComponentTokens extends GpComponentBaseTokens {}
export interface GpConfirmDialogComponentTokens extends GpComponentBaseTokens {}
export interface GpDrawerComponentTokens extends GpComponentBaseTokens {}
export interface GpPopoverComponentTokens extends GpComponentBaseTokens {}
export interface GpBreadcrumbComponentTokens extends GpComponentBaseTokens {}
export interface GpContextMenuComponentTokens extends GpComponentBaseTokens {}
export interface GpDockComponentTokens extends GpComponentBaseTokens {}
export interface GpMegaMenuComponentTokens extends GpComponentBaseTokens {}
export interface GpMenuComponentTokens extends GpComponentBaseTokens {}
export interface GpMenubarComponentTokens extends GpComponentBaseTokens {}
export interface GpPanelMenuComponentTokens extends GpComponentBaseTokens {}
export interface GpStepperComponentTokens extends GpComponentBaseTokens {}
export interface GpTabsComponentTokens extends GpComponentBaseTokens {}
export interface GpTieredMenuComponentTokens extends GpComponentBaseTokens {}
export interface GpToolbarComponentTokens extends GpComponentBaseTokens {}
export interface GpAccordionComponentTokens extends GpComponentBaseTokens {}
export interface GpDividerComponentTokens extends GpComponentBaseTokens {}
export interface GpFieldsetComponentTokens extends GpComponentBaseTokens {}
export interface GpPanelComponentTokens extends GpComponentBaseTokens {}
export interface GpScrollPanelComponentTokens extends GpComponentBaseTokens {}
export interface GpSplitterComponentTokens extends GpComponentBaseTokens {}
export interface GpBadgeComponentTokens extends GpComponentBaseTokens {}
export interface GpMessageComponentTokens extends GpComponentBaseTokens {}
export interface GpProgressBarComponentTokens extends GpComponentBaseTokens {}
export interface GpProgressSpinnerComponentTokens extends GpComponentBaseTokens {}
export interface GpSkeletonComponentTokens extends GpComponentBaseTokens {}
export interface GpTagComponentTokens extends GpComponentBaseTokens {}
export interface GpOrgChartComponentTokens extends GpComponentBaseTokens {}
export interface GpTreeComponentTokens extends GpComponentBaseTokens {}
export interface GpAvatarComponentTokens extends GpComponentBaseTokens {}
export interface GpCarouselComponentTokens extends GpComponentBaseTokens {}
export interface GpChipComponentTokens extends GpComponentBaseTokens {}
export interface GpEmptyStateComponentTokens extends GpComponentBaseTokens {}
export interface GpImageComponentTokens extends GpComponentBaseTokens {}
export interface GpMeterGroupComponentTokens extends GpComponentBaseTokens {}
export interface GpTimelineComponentTokens extends GpComponentBaseTokens {}

export interface GpGridComponentTokens extends GpComponentBaseTokens {
  rowGap?: string;
  columnGap?: string;
  guideBorderColor?: string;
  placeholderBorderColor?: string;
  placeholderBackground?: string;
}

export interface GpGridWidgetComponentTokens extends GpHeaderBodyFooterComponentTokens {
  dragHandleColor?: string;
  dragHandleHoverColor?: string;
  resizeHandleColor?: string;
  lockedBorderColor?: string;
}

export interface GpBlockCardComponentTokens extends GpHeaderBodyFooterComponentTokens {}

export interface GpSidebarComponentTokens extends GpComponentBaseTokens {
  width?: string;
  navItemPadding?: string;
  navItemMargin?: string;
  navItemGap?: string;
  darkBackground?: string;
  lightBackground?: string;
  navItemHoverBackground?: string;
  navItemActiveBackground?: string;
  navItemActiveColor?: string;
}

export interface GpKpiCardComponentTokens extends GpComponentBaseTokens {
  trendGap?: string;
  labelColor?: string;
  valueColor?: string;
  valueFontSize?: string;
  iconBackground?: string;
  trendPositiveColor?: string;
  trendNegativeColor?: string;
  trendNeutralColor?: string;
}

export interface GpCommandPaletteComponentTokens extends GpOverlayComponentBaseTokens {
  headerBackground?: string;
  inputBackground?: string;
  shortcutBadgeBackground?: string;
  shortcutBadgeColor?: string;
  groupTitleColor?: string;
}

export interface GpFormFieldComponentTokens extends GpComponentBaseTokens {
  labelColor?: string;
  labelFocusColor?: string;
  helperTextColor?: string;
  errorTextColor?: string;
  addonColor?: string;
}

export interface GpBottomSheetComponentTokens extends GpComponentBaseTokens {
  handleColor?: string;
  handleWidth?: string;
  handleHeight?: string;
  maxHeight?: string;
}

export interface GpDateRangePickerComponentTokens extends GpComponentBaseTokens {
  background?: string;
  borderColor?: string;
  rangeBackground?: string;
  rangeText?: string;
  selectedBackground?: string;
  selectedText?: string;
  headerBackground?: string;
}

export interface GpStatCardComponentTokens extends GpComponentBaseTokens {
  background?: string;
  borderColor?: string;
  valueColor?: string;
  valueFontSize?: string;
  trendPositiveColor?: string;
  trendNegativeColor?: string;
  trendNeutralColor?: string;
  iconBackground?: string;
}

export interface GpAnnouncementBarComponentTokens extends GpComponentBaseTokens {
  background?: string;
  color?: string;
  borderColor?: string;
  height?: string;
  fontSize?: string;
  actionButtonBackground?: string;
  actionButtonColor?: string;
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
  dateRangePicker?: GpDateRangePickerComponentTokens;
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
  commandPalette?: GpCommandPaletteComponentTokens;
  formField?: GpFormFieldComponentTokens;
  bottomSheet?: GpBottomSheetComponentTokens;
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
  statCard?: GpStatCardComponentTokens;
  announcementBar?: GpAnnouncementBarComponentTokens;
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

export interface Options {
    backgroundImage?: string | string[],
    MediaAttribution?: boolean,
    applePay?: boolean,
    CapitalizeFields?: boolean,
    ClickToExpand?: boolean,
    CurrencySymbol?: string,
    CurrencySeparator?: string,
    SkipToMainContentLink?: boolean,
    SrcDefer?: boolean,
    NeverBounceAPI?: string | null,
    NeverBounceDateField?: string | null,
    NeverBounceStatusField?: string | null,
    ProgressBar?: boolean | null,
    Debug?: boolean,
    onLoad?: () => void,
    onResize?: () => void,
    onSubmit?: () => void,
    onError?: () => void,
    onValidate?: () => void,
}

export const OptionsDefaults: Options = {
    backgroundImage: '',
    MediaAttribution: true,
    applePay: false,
    CapitalizeFields: false,
    ClickToExpand: true,
    CurrencySymbol: '$',
    CurrencySeparator: '.',
    SkipToMainContentLink: true,
    SrcDefer: true,
    NeverBounceAPI: null,
    NeverBounceDateField: null,
    NeverBounceStatusField: null,
    ProgressBar: false,
    Debug: false,
}
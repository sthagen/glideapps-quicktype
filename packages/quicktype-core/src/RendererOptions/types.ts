import type { EnumOption, Option } from "./index";
import type { OptionDefinition as CommandLineArgsOptionDefinition } from "command-line-args";

/**
 * Primary options show up in the web UI in the "Language" settings tab,
 * Secondary options in "Other".
 * CLI is only for cli
 */
export type OptionKind = "primary" | "secondary" | "cli";
export type OptionType = "string" | "boolean" | "enum";

export interface OptionDefinition<Name extends string = string, T = unknown>
    extends CommandLineArgsOptionDefinition {
    /** Option Name */
    name: Name;
    /** Option Description */
    description: string;
    /** Category of Option */
    optionType: OptionType;
    /** Default Value for Option */
    defaultValue?: T;
    /** Enum only, map of possible keys and values */
    values?: Record<string, unknown>;

    /** Primary, Secondary, or CLI */
    kind?: OptionKind;
    /** Whether multiple CLI inputs are allowed for this option */
    multiple?: boolean;

    // Unknown
    typeLabel?: string;
}

export type OptionName<O> = O extends Option<infer Name, unknown>
    ? Name
    : never;
export type OptionValue<O> = O extends EnumOption<
    string,
    infer EnumMap,
    infer EnumKey
>
    ? EnumMap[EnumKey]
    : O extends Option<string, infer Value>
      ? Value
      : never;

export type OptionKey<O> = O extends EnumOption<
    string,
    Record<string, unknown>,
    infer EnumKey
>
    ? EnumKey
    : O;

// FIXME: Merge these and use camelCase user-facing keys (v24)
export type OptionMap<T> = {
    [K in keyof T as OptionName<T[K]>]: OptionKey<T[K]>;
}; // user-facing, keys are `name` property of Option, values are the available input type
export type OptionValues<T> = { [K in keyof T]: OptionValue<T[K]> }; // internal, keys are keys of `_Options` object in each language file

import { conditionFieldOptions } from "src/app/shared/components/configuration/advanced-settings/advanced-settings.fixture";
import { Operator } from "../enum/enum.model";
import { ConditionField, constructPayload1, constructPayload2, SkipExport } from "./skip-export.model";

  describe('constructPayload1', () => {
    let valueField: {
      condition1: ConditionField;
      operator1: SkipExport['operator'];
      value1: string[];
      join_by?: SkipExport['join_by'];
    };
    let valueOption1: any[];

    beforeEach(() => {
      valueField = {
        condition1: { field_name: 'some_field', type: 'STRING', is_custom: false },
        operator1: Operator.IExact,
        value1: ['some_value']
      };
      valueOption1 = ['some_option'];
    });

    it('should return a SkipExport object', () => {
      const result = constructPayload1(valueField, valueOption1);
    });

    it('should set the custom_field_type field to valueField.condition1.type when valueField.condition1.is_custom is true', () => {
      valueField.condition1.is_custom = true;
      const result = constructPayload1(valueField, valueOption1);
      expect(result.custom_field_type).toEqual(valueField.condition1.type);
    });

    it('should set the custom_field_type field to null when valueField.condition1.is_custom is false', () => {
      valueField.condition1.is_custom = false;
      const result = constructPayload1(valueField, valueOption1);
      expect(result.custom_field_type).toBeNull();
    });
});

describe('constructPayload2', () => {
  const condition: ConditionField = {
    field_name: 'field',
    type: 'STRING',
    is_custom: false
  };
  const operator: SkipExport['operator'] = Operator.IExact;
  const value: string[] = ['value'];

  it('should return a payload with valueOption2 as values property when condition type is not DATE, operator is not isnull, and field name is not report_title', () => {
    const valueOption = ['value option'];
    const conditionWithTypeString: ConditionField = { ...condition, type: 'STRING' };
    const payload = constructPayload2({ condition2: conditionWithTypeString, operator2: operator, value2: [] }, valueOption);
    expect(payload.values).toEqual(valueOption);
  });

  it('should return a payload with value2 as values property when condition type is DATE', () => {
    const conditionWithTypeDate: ConditionField = { ...condition, type: 'DATE' };
    const payload = constructPayload2({ condition2: conditionWithTypeDate, operator2: operator, value2: value }, []);
    expect(payload.values).toEqual(value);
  });

  it('should return a payload with value2 as values property when operator is isnull', () => {
    const operatorIsNull: SkipExport['operator'] = Operator.IsNull;
    const payload = constructPayload2({ condition2: condition, operator2: operatorIsNull, value2: value }, []);
    expect(payload.values).toEqual(value);
  });
});
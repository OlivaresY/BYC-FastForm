import { act, renderHook } from "@testing-library/react-native";
import { useApplicantStepViewModel } from "../hooks/useApplicantStepViewModel";

describe("useApplicantStepViewModel - Identification Normalization", () => {
  describe("Physical Person ID Normalization", () => {
    it("validates physical identification containing hyphens when digit count meets minimum", () => {
      const { result } = renderHook(() =>
        useApplicantStepViewModel({ initialRegime: "physical" }),
      );

      // '1-1234-0567' has 9 digits
      act(() => {
        result.current.onPhysicalFieldChange(
          "identificationNumber",
          "1-1234-0567",
        );
      });

      expect(result.current.isIdentificationValid).toBe(true);
    });

    it("validates physical identification containing spaces when digit count meets minimum", () => {
      const { result } = renderHook(() =>
        useApplicantStepViewModel({ initialRegime: "physical" }),
      );

      // '1 1234 0567' has 9 digits
      act(() => {
        result.current.onPhysicalFieldChange(
          "identificationNumber",
          "1 1234 0567",
        );
      });

      expect(result.current.isIdentificationValid).toBe(true);
    });

    it("validates physical identification containing mixed formatting (hyphens and spaces)", () => {
      const { result } = renderHook(() =>
        useApplicantStepViewModel({ initialRegime: "physical" }),
      );

      // ' 1 - 1234 - 0567 ' has 9 digits
      act(() => {
        result.current.onPhysicalFieldChange(
          "identificationNumber",
          " 1 - 1234 - 0567 ",
        );
      });

      expect(result.current.isIdentificationValid).toBe(true);
    });

    it("invalidates physical identification when stripped digit count is less than 9", () => {
      const { result } = renderHook(() =>
        useApplicantStepViewModel({ initialRegime: "physical" }),
      );

      // '1-1234-056' has 8 digits
      act(() => {
        result.current.onPhysicalFieldChange(
          "identificationNumber",
          "1-1234-056",
        );
      });

      expect(result.current.isIdentificationValid).toBe(false);
    });

    it("invalidates physical identification with non-digit characters only having few digits", () => {
      const { result } = renderHook(() =>
        useApplicantStepViewModel({ initialRegime: "physical" }),
      );

      // '1-2-3-4-5-6-7-8' has only 8 digits
      act(() => {
        result.current.onPhysicalFieldChange(
          "identificationNumber",
          "1-2-3-4-5-6-7-8",
        );
      });

      expect(result.current.isIdentificationValid).toBe(false);
    });
  });

  describe("Legal Entity ID Normalization", () => {
    it("validates legal entity identification containing hyphens when digit count meets minimum (10 digits)", () => {
      const { result } = renderHook(() =>
        useApplicantStepViewModel({ initialRegime: "legal" }),
      );

      // '3-101-123456' has 10 digits
      act(() => {
        result.current.onLegalFieldChange(
          "identificationNumber",
          "3-101-123456",
        );
      });

      expect(result.current.isIdentificationValid).toBe(true);
    });

    it("validates legal entity identification containing spaces when digit count meets minimum", () => {
      const { result } = renderHook(() =>
        useApplicantStepViewModel({ initialRegime: "legal" }),
      );

      // '3 101 123456' has 10 digits
      act(() => {
        result.current.onLegalFieldChange(
          "identificationNumber",
          "3 101 123456",
        );
      });

      expect(result.current.isIdentificationValid).toBe(true);
    });

    it("invalidates legal entity identification when stripped digit count is less than 10", () => {
      const { result } = renderHook(() =>
        useApplicantStepViewModel({ initialRegime: "legal" }),
      );

      // '3-101-12345' has 9 digits
      act(() => {
        result.current.onLegalFieldChange(
          "identificationNumber",
          "3-101-12345",
        );
      });

      expect(result.current.isIdentificationValid).toBe(false);
    });
  });
});

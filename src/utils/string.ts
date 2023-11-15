export default function shortenString(
  input: string,
  maxLength: number,
  cutX = 10
): string {
  if (input && input.length > maxLength) {
    return `${input.slice(0, cutX)}...${input.slice(input.length - cutX)}`;
  } else {
    return input;
  }
}

export const cowNames = [
  "Camilo", "Luna", "Bella", "Rocky", "Max", "Lucy", "Charlie", "Daisy",
  "Bailey", "Molly", "Buddy", "Maggie", "Tucker", "Sophie", "Riley", "Sadie",
  "Jack", "Lily", "Duke", "Zoe", "Cooper", "Stella", "Oliver", "Ruby",
  "Bear", "Penny", "Winston", "Rosie", "Leo", "Milo"
];

export const getCowName = (id: number): string => {
  return cowNames[id % cowNames.length];
}; 
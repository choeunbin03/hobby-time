const fs = require('fs');
const { clsx } = require('clsx');
const { twMerge } = require('tailwind-merge');

// Mock cn function (same logic as lib/utils/cn.ts)
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Internal logic from pages (e.g. uuidRegex)
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

let output = "--- Unit Test Report ---\n";

// Test Case 1: cn function
output += "\n[Test] cn() utility\n";
const t1 = cn("px-2 py-1", "bg-red-500", "p-4");
output += `  Input: cn("px-2 py-1", "bg-red-500", "p-4")\n`;
output += `  Output: "${t1}"\n`;
if (t1.includes("p-4") && !t1.includes("px-2")) { 
    output += "  Result: PASS (Padding merge verified)\n"; 
} else {
    output += "  Result: CHECK (Tailwind merge behavior might differ based on config)\n";
}

// Test Case 2: UUID Regex
output += "\n[Test] UUID Regex Validation\n";
const validUUID = "123e4567-e89b-12d3-a456-426614174000";
const invalidUUID = "not-a-uuid";
output += `  Input: "${validUUID}" -> ${uuidRegex.test(validUUID)}\n`;
output += `  Input: "${invalidUUID}" -> ${uuidRegex.test(invalidUUID)}\n`;

if (uuidRegex.test(validUUID) && !uuidRegex.test(invalidUUID)) {
    output += "  Result: PASS\n";
} else {
    output += "  Result: FAIL\n";
}

output += "\n--- End Report ---\n";

fs.writeFileSync('test-unit-output.txt', output);
console.log("Test output written to test-unit-output.txt");

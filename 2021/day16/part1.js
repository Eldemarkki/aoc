const { readLines } = require("../../utils/input");

const input = readLines()[0]

const hexToBin = hex => {
  let res = "";
  for (const letter of Array.from(hex)) {
    res = res + parseInt(letter, 16).toString(2).padStart(4, "0")
  }
  return res
}

const bitsStr = hexToBin(input);
const bitsToDecimal = bits => parseInt(bits.join(""), 2);

const parseLiteralPacket = packetBits => {
  let startBitIndex = 0
  const byteBits = []
  let packetSize = 0;
  if (packetBits[startBitIndex] === 0) {
    const current = packetBits.slice(startBitIndex + 1, startBitIndex + 5)
    byteBits.push(...current)
    startBitIndex += 5
    packetSize += 5
  }
  else {
    while (true) {
      const current = packetBits.slice(startBitIndex + 1, startBitIndex + 5)
      byteBits.push(...current)
      startBitIndex += 5
      packetSize += 5
      if (packetBits[startBitIndex] === 0) {
        const current = packetBits.slice(startBitIndex + 1, startBitIndex + 5)
        byteBits.push(...current)
        startBitIndex += 5
        packetSize += 5
        break;
      };
    }
  }

  return { byteBits, packetSize };
}

const parsePacket = bits => {
  const versionBits = bits.slice(0, 3)
  const version = bitsToDecimal(versionBits)

  const packetTypeIdBits = bits.slice(3, 6)
  const packetTypeId = bitsToDecimal(packetTypeIdBits)
  const rest = bits.slice(6);

  if (packetTypeId === 4) {
    // Literal value packet
    const { byteBits, packetSize } = parseLiteralPacket(rest);
    return {
      type: "literal",
      version,
      decimalValue: bitsToDecimal(byteBits),
      packetSize: 3 + 3 + packetSize
    }
  }
  else {
    // Operator packet
    const lengthTypeId = rest[0]
    const lengthAndPackets = rest.slice(1)

    if (lengthTypeId === 1) {
      // Length type id == 1
      const packetCountBits = lengthAndPackets.slice(0, 11)
      const packetCount = bitsToDecimal(packetCountBits)

      const packets = []
      let usedBits = 0;
      for (let i = 0; i < packetCount; i++) {
        const b = lengthAndPackets.slice(11 + usedBits)
        const newPacket = parsePacket(b)
        usedBits += newPacket.packetSize
        packets.push(newPacket)
      }

      return {
        type: "operator packet 1",
        version,
        subPackets: packets,
        packetSize: 3 + 3 + 1 + 11 + usedBits
      }
    }
    else {
      // Length type id == 0
      const lengthCount = bitsToDecimal(lengthAndPackets.slice(0, 15))
      const packetBits = lengthAndPackets.slice(15, 15 + lengthCount);
      let bitsLeft = packetBits.length;
      const parsedPackets = []

      while (bitsLeft > 0) {
        let bitsUsed = packetBits.length - bitsLeft;
        const packet = parsePacket(packetBits.slice(bitsUsed))
        parsedPackets.push(packet.length === 1 ? packet[0] : packet)
        bitsLeft -= packet.packetSize
      }

      return {
        type: "operator packet 0",
        version,
        subPackets: parsedPackets,
        packetSize: 3 + 3 + 1 + 15 + lengthCount
      }
    }
  }
}

const result = parsePacket(Array.from(bitsStr).map(Number));

const calculateVersionSum = packet => {
  if (Array.isArray(packet.subPackets)) {
    let sum = 0;
    packet.subPackets.forEach(p => {
      sum += calculateVersionSum(p)
    })
    return sum + packet.version
  }
  else {
    return packet.version
  }
}

console.log(calculateVersionSum(result))
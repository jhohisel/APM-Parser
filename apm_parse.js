/* Reads the Apple Driver Map and Apple Partition Map of a disk file */

const fs = require('fs'),
      path = require('path')

const file = process.argv[2]

const INT = 2, // Integer = 2 bytes
      LONG = 4, // LongInt = 4 bytes
      HEX = 16,
      DEC = 10
      ADM_SIZE = 512,
      APM_SIZE = 0 // TBD

let cursor = 0

const validateMagic = (buf) => {
  // TODO: Implement
  return true
}

const parse = (buf, len, radix) => {
  let val = 0, i = 0
  // Convert for little-endian
  cursor += len - 1
  while (i < len) { val += buf[cursor--] << (8 * i++) }
  cursor += i + 1
  return val.toString(radix)
}

const handleFile = (fd) => {
  const driverMap = new ArrayBuffer(ADM_SIZE)
  // const pm = new ArrayBuffer()
  fs.read(fd, Buffer.from(driverMap), 0, ADM_SIZE, 0, (err, numBytes, buf) => {
    if (!err && numBytes == ADM_SIZE && validateMagic(buf)) {
      parseAppleDriverMap(buf)
    } else {
      console.error("Invalid file")
      process.exit(1)
    }
  })
  // fs.read(fd)
}

/*
Apple Driver Map
Block0 Device Structure (512 bytes)
--------------------------------------------------------------------------------
0-1       sbSig:         Integer;    {device signature, always 0x4552}
2-3       sbBlkSize:     Integer;    {block size of the device}
4-7       sbBlkCount:    LongInt;    {number of blocks on the device}
8-9       sbDevType:     Integer;    {reserved}
10-11     sbDevId:       Integer;    {reserved}
12-15     sbData:        LongInt;    {reserved}
16-17     sbDrvrCount:   Integer;    {number of driver descriptor entries}
18-21     ddBlock:       LongInt;    {first driver's starting block}
22-23     ddSize:        Integer;    {size of the driver, in 512-byte blocks}
24-25     ddType:        Integer;    {operating system type (MacOS = 1)}
26-511    ddPad:         ARRAY [0..242] OF Integer; {additional drivers, if any}
--------------------------------------------------------------------------------
*/
const parseAppleDriverMap = (buf) => {
  console.log(`Signature value is 0x${parse(buf, INT, HEX)}`)
  console.log(`Block size of device is ${parse(buf, INT, DEC)}-byte blocks.`)
  console.log(`Number of blocks on device is ${parse(buf, LONG, DEC)} blocks.`)
  console.log(`Device type ${parse(buf, INT, DEC)}`)
  console.log(`Device ID ${parse(buf, INT, DEC)}`)
  console.log(`Data (reserved) ${parse(buf, LONG, DEC)}`)
  console.log(`Driver count ${parse(buf, INT, DEC)}`)
  console.log(`Driver starting block ${parse(buf, LONG, DEC)}`)
  console.log(`Driver size (in 512-byte blocks) ${parse(buf, INT, DEC)}`)
  console.log(`Operating system type ${parse(buf, INT, DEC)} (MacOS = 1)`)
}

/*
Apple Partition Map
Partition Device Structure (512 bytes)
-----------------------------------------------------------------
0-1        pmSig:            Integer;    {partition signature}
2-3        pmSigPad:         Integer;    {reserved}
4-7        pmMapBlkCnt:      LongInt;    {number of blocks in partition map}
8-11       pmPyPartStart:    LongInt;    {first physical block of partition}
12-15      pmPartBlkCnt:     LongInt;    {number of blocks in partition}
16-47      pmPartName:       PACKED ARRAY [0..31] OF Char; {partition name}
48-79      pmParType:        PACKED ARRAY [0..31] OF Char; {partition type}
80-83      pmLgDataStart:    LongInt;    {first logical block of data area}
84-87      pmDataCnt:        LongInt;    {number of blocks in data area}
88-91      pmPartStatus:     LongInt;    {partition status information}
92-95      pmLgBootStart:    LongInt;    {first logical block of boot code}
96-99      pmBootSize:       LongInt;    {size of boot code, in bytes}
100-103    pmBootAddr:       LongInt;    {boot code load address}
104-107    pmBootAddr2:      LongInt;    {reserved}
108-111    pmBootEntry:      LongInt;    {boot code entry point}
112-115    pmBootEntry2:     LongInt;    {reserved}
116-119    pmBootCksum:      LongInt;    {boot code checksum}
120-135    pmProcessor:      PACKED ARRAY [0..15] OF Char; {processor type}
136-511    pmPad:            ARRAY [0..187] OF Integer; {reserved}
-----------------------------------------------------------------
*/
const parseApplePartitionMap = (buf) => {

}

if (file) {
  fs.open(path.resolve(file), (err, fd) => {
    if (err) {
      console.error(er)
    } else {
      handleFile(fd)
    }
  })
} else {
  console.error("Please specify a file")
}
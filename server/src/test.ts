import parseTorrent from "parse-torrent";
import { readFileSync } from "fs";

let torrent = parseTorrent(readFileSync("./a.torrent"));

console.log(torrent);

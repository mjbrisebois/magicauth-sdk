{ pkgs ? import <nixpkgs> {} }:

pkgs.stdenv.mkDerivation {
  name = "magicauth-sdk";
  src = pkgs.gitignoreSource ./.;

  buildInputs = [
    pkgs.sqlite
  ];

  nativeBuildInputs = [
    pkgs.nodejs-12_x
  ];
}

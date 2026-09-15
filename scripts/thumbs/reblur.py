#!/usr/bin/env python3
"""Borra uma faixa de um mockup do designer, para isolar UM componente.

Os mockups de `Banners E-temas` já chegam com a página inteira borrada e só o
componente em foco nítido. Quando um mockup deixa DOIS componentes nítidos, esta
ferramenta produz as duas variantes: para cada uma, borra a faixa do outro.

A faixa é um quadrilátero porque o notebook está girado ~3-4° no mockup — um
retângulo reto deixaria um degrau visível na borda. A máscara é desfocada antes
de compor (`--feather`) para que a transição nítido→borrado imite a do designer,
que é suave.

  reblur.py entrada.jpg saida.jpg --blur "x1,y1 x2,y2 x3,y3 x4,y4" [--blur ...]

Pontos em sentido horário, em pixels da imagem original. `--raio` controla a
intensidade (padrão 14, medido para bater com o borrado original a 1920px).
"""
import argparse
from PIL import Image, ImageDraw, ImageFilter


def ponto(txt):
    x, y = txt.split(",")
    return (float(x), float(y))


def poligono(txt):
    pts = [ponto(p) for p in txt.split()]
    if len(pts) < 3:
        raise argparse.ArgumentTypeError("um polígono precisa de ao menos 3 pontos")
    return pts


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("entrada")
    ap.add_argument("saida")
    ap.add_argument("--blur", type=poligono, action="append", required=True,
                    help='polígono a borrar: "x1,y1 x2,y2 x3,y3 x4,y4"')
    ap.add_argument("--raio", type=float, default=14.0)
    ap.add_argument("--feather", type=float, default=6.0)
    a = ap.parse_args()

    img = Image.open(a.entrada).convert("RGB")
    borrada = img.filter(ImageFilter.GaussianBlur(a.raio))

    mascara = Image.new("L", img.size, 0)
    d = ImageDraw.Draw(mascara)
    for pol in a.blur:
        d.polygon(pol, fill=255)
    if a.feather > 0:
        mascara = mascara.filter(ImageFilter.GaussianBlur(a.feather))

    # composite(a, b, m): m=255 -> a. Queremos borrado onde a máscara marca.
    Image.composite(borrada, img, mascara).save(a.saida, quality=95, subsampling=0)
    print(f"{a.saida}  ({len(a.blur)} faixa(s) borrada(s), raio {a.raio})")


if __name__ == "__main__":
    main()

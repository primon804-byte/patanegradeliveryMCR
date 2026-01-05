
import { Product, ProductCategory, BeerType } from './types';

// ==============================================================================
// CONFIGURAÇÃO DOS WHATSAPPS (POR UNIDADE)
// ==============================================================================
export const WHATSAPP_NUMBERS = {
  // Filial - Marechal Cândido Rondon
  MARECHAL: "5545988175171", 
  // Matriz - Foz do Iguaçu
  FOZ: "5545999901000" 
};

// Mantido para compatibilidade se necessário
export const WHATSAPP_NUMBER = "5545988175171"; 

// ==============================================================================
// CONFIGURAÇÃO DO FLYER / DESTAQUE
// ==============================================================================
export const HERO_IMAGES = [
  'https://i.ibb.co/jZWpr3kK/IMG-9249-1.jpg',
];

export const PRODUCTS: Product[] = [
  // ============================================================================
  // GROWLERS 
  // ORDEM: Campeão -> Mais Pedidos -> Menor Preço -> Maior Preço
  // ============================================================================
  
  // 1. CAMPEÃO DE VENDAS
  {
    id: 'growler-pilsen-cristal-1l',
    name: 'Pilsen Cristal 1L',
    description: 'A típica Pilsen dos brasileiros. Cerveja clara, leve, refrescante e de baixo amargor.',
    price: 16,
    image: 'https://www.starkdistribuidora.com.br/storage/products/PWekuFutk8cQeNmz.jpg',
    category: ProductCategory.GROWLER,
    type: BeerType.PILSEN,
    volumeLiters: 1,
    isChampion: true, 
    abv: 4.5,
    ibu: 7,
    pairing: 'Hambúrguer, Massas, Aperitivos, Queijos',
  },

  // 2. MAIS PEDIDOS
  {
    id: 'growler-vinho-branco-1l',
    name: 'Chopp de Vinho Branco 1L',
    description: 'Fermentado de uvas Moscato, levemente adocicado, ideal para dias quentes.',
    price: 20,
    image: 'https://www.starkdistribuidora.com.br/storage/products/a95saNB5bXxb9oOg.jpg',
    category: ProductCategory.GROWLER,
    type: BeerType.LAGER,
    volumeLiters: 1,
    isPopular: true,
    abv: 5.0,
    ibu: 0,
    pairing: 'Carnes assadas, Queijos, Massas, Sobremesas',
  },
  {
    id: 'growler-vinho-tinto-1l',
    name: 'Chopp de Vinho Tinto 1L',
    description: 'Fermentado de uvas Isabel e Bordeaux, com perfil frisante e creme marcante.',
    price: 20,
    image: 'https://www.starkdistribuidora.com.br/storage/products/TQp206a6s5GjQbRy.jpg',
    category: ProductCategory.GROWLER,
    type: BeerType.LAGER,
    volumeLiters: 1,
    isPopular: true,
    abv: 5.0,
    ibu: 0,
    pairing: 'Carnes, Queijos, Massas, Sobremesas',
  },
  {
    id: 'growler-session-ipa-1l',
    name: 'Session IPA 1L',
    description: 'Cerveja leve, dourada, extremamente refrescante, com amargor moderado e aroma cítrico intenso.',
    price: 22,
    image: 'https://www.starkdistribuidora.com.br/storage/products/L8ciZMapSqAfmEja.jpg',
    category: ProductCategory.GROWLER,
    type: BeerType.IPA,
    volumeLiters: 1,
    isPopular: true,
    abv: 5.0,
    ibu: 30,
    pairing: 'Hambúrguer, Comida mexicana, Carne assada, Massas',
  },

  // 3. ORDENADOS POR PREÇO (Crescente)
  
  // R$ 17,00
  {
    id: 'growler-premium-lager-1l',
    name: 'Premium Lager 1L',
    description: 'Cerveja dourada com notas maltadas, corpo médio, amargor moderado e espuma cremosa.',
    price: 17,
    image: 'https://www.starkdistribuidora.com.br/storage/products/u9xHRJtgWyiKh3r2.jpg',
    category: ProductCategory.GROWLER,
    type: BeerType.LAGER,
    volumeLiters: 1,
    abv: 4.5,
    ibu: 12,
    pairing: 'Hambúrguer, Massas, Pizza, Frutos do mar',
  },

  // R$ 22,00 (Vários Estilos)
  {
    id: 'growler-weiss-1l',
    name: 'Hefe Weiss 1L',
    description: 'A clássica cerveja de trigo com espuma espessa, notas de cravo e banana, super encorpada e turva.',
    price: 22,
    image: 'https://www.starkdistribuidora.com.br/storage/products/Xqx1A0xpvoqXZVPa.jpg',
    category: ProductCategory.GROWLER,
    type: BeerType.WEISS,
    volumeLiters: 1,
    abv: 5.0,
    ibu: 10,
    pairing: 'Frutos do mar, saladas, carnes assadas e sobremesas.',
  },
  {
    id: 'growler-amber-lager-1l',
    name: 'Amber Lager 1L',
    description: 'Uma cerveja de coloração acobreada com notas maltadas e de caramelo sutis, corpo leve, espuma densa e leve aroma cítrico.',
    price: 22,
    image: 'https://www.starkdistribuidora.com.br/storage/products/aJBURtIgjVu9rYnY.jpg',
    category: ProductCategory.GROWLER,
    type: BeerType.AMBER,
    volumeLiters: 1,
    abv: 5.3,
    ibu: 32,
    pairing: 'Carne grelhada, queijos, comida mexicana e massas',
  },
  {
    id: 'growler-munich-dunkel-1l',
    name: 'Munich Dunkel 1L',
    description: 'Uma cerveja de coloração escura com notas sutis de torrefação e chocolate, porém com corpo leve e alta drinkability.',
    price: 22,
    image: 'https://www.starkdistribuidora.com.br/storage/products/Kafn923yCHTVE6zi.jpg',
    category: ProductCategory.GROWLER,
    type: BeerType.DUNKEL,
    volumeLiters: 1,
    abv: 4.9,
    ibu: 22,
    pairing: 'Carne grelhada, queijos, comida mexicana, massas e chocolate',
  },
  {
    id: 'growler-apa-1l',
    name: 'APA (American Pale Ale) 1L',
    description: 'Cerveja lupulada, vibrante e equilibrada, com cor dourada a âmbar. Destaca aromas e sabores frutados e florais.',
    price: 22,
    image: 'https://www.starkdistribuidora.com.br/storage/products/PWphBJTczinHDNvE.jpg',
    category: ProductCategory.GROWLER,
    type: BeerType.APA,
    volumeLiters: 1,
    abv: 5.0,
    ibu: 30,
    pairing: 'Hambúrgueres, carnes grelhadas e petiscos',
  },
  {
    id: 'growler-red-ale-1l',
    name: 'Irish Red Ale 1L',
    description: 'Estilo que chama atenção pela sua coloração avermelhada, corpo maltado e amargor equilibrado.',
    price: 22,
    image: 'https://www.starkdistribuidora.com.br/storage/products/SUtX5lAwAKA1c1ys.jpg',
    category: ProductCategory.GROWLER,
    type: BeerType.RED_ALE,
    volumeLiters: 1,
    abv: 4.5,
    ibu: 20,
    pairing: 'Carnes vermelhas, queijos suaves e batatas',
  },
  {
    id: 'growler-vienna-lager-1l',
    name: 'Vienna Lager 1L',
    description: 'Chopp de coloração âmbar, que traz leveza e elegância representadas por notas carameladas e de torras sutis.',
    price: 22,
    image: 'https://www.starkdistribuidora.com.br/storage/products/JFb2kUF6kgzldrmA.jpg',
    category: ProductCategory.GROWLER,
    type: BeerType.VIENNA,
    volumeLiters: 1,
    abv: 5.2,
    ibu: 21,
    pairing: 'Carne assada, comida alemã, comida mexicana, ao menos sopas e caldos',
  },

  // R$ 26,00
  {
    id: 'growler-american-ipa-1l',
    name: 'American IPA 1L',
    description: 'IPA de coloração acobreada, com amargor moderado e aromas cítricos intensos, remetendo ao maracujá.',
    price: 26,
    image: 'https://www.starkdistribuidora.com.br/storage/products/8OSjWs8QLdlDOtLo.jpg',
    category: ProductCategory.GROWLER,
    type: BeerType.IPA,
    volumeLiters: 1,
    abv: 6.1,
    ibu: 47,
    pairing: 'Hambúrguer, Carne assada, Comida mexicana, Massas',
  },

  // R$ 30,00 (Sours)
  {
    id: 'growler-sour-amarelas-1l',
    name: 'Sour Frutas Amarelas 1L',
    description: 'Combinando a refrescância do estilo com a singularidade do aroma e do sabor de maracujá, apresenta coloração amarela, espuma de boa formação e média persistência.',
    price: 30,
    image: 'https://www.starkdistribuidora.com.br/storage/products/UkTZ1J7RDeHAa0hf.jpg',
    category: ProductCategory.GROWLER,
    type: BeerType.SOUR,
    volumeLiters: 1,
    abv: 5.0,
    ibu: 9,
    pairing: 'Queijos, sobremesas e comida agridoce',
  },
  {
    id: 'growler-sour-vermelhas-1l',
    name: 'Sour Frutas Vermelhas 1L',
    description: 'Uma cerveja que chama atenção só de olhar! De coloração rosa, recebe generosas doses de morango, framboesa e amora. Corpo leve, seco e acidez balanceada.',
    price: 30,
    image: 'https://www.starkdistribuidora.com.br/storage/products/4q9srCWSapkmrDOh.jpg',
    category: ProductCategory.GROWLER,
    type: BeerType.SOUR,
    volumeLiters: 1,
    abv: 5.0,
    ibu: 10,
    pairing: 'Queijos, sobremesas e comida agridoce',
  },

  // ============================================================================
  // BARRIS 30L (Prioridade: Pilsen, Premium Lager, Vinho Branco)
  // ============================================================================
  {
    id: 'keg-pilsen-30',
    name: 'Barril Pilsen 30L',
    description: 'A típica Pilsen dos brasileiros. Cerveja clara, leve, refrescante e de baixo amargor.',
    price: 387, // Atualizado para Marechal Cândido Rondon
    image: 'https://i.ibb.co/szz3tB3/patanegra-1765760642049.png',
    category: ProductCategory.KEG30,
    type: BeerType.PILSEN,
    volumeLiters: 30,
    isChampion: true, // Campeão de Vendas
    abv: 4.5,
    ibu: 7,
    pairing: 'Churrasco completo, frango a passarinho e pizza margherita.',
  },
  {
    id: 'keg-lager-30',
    name: 'Barril Premium Lager 30L',
    description: 'Cerveja dourada com notas maltadas, corpo médio, amargor moderado e espuma cremosa.',
    price: 420,
    image: 'https://i.ibb.co/4w56W9gb/patanegra-1765760786878.png',
    category: ProductCategory.KEG30,
    type: BeerType.LAGER,
    volumeLiters: 30,
    isPopular: true, // Volta a ser Mais Pedido
    abv: 4.5,
    ibu: 12,
    pairing: 'Hambúrguer, Massas, Pizza, Frutos do mar',
  },
  {
    id: 'keg-vinho-branco-30',
    name: 'Barril Vinho Branco 30L',
    description: 'Fermentado de uvas Moscato, levemente adocicado, ideal para dias quentes.',
    price: 450,
    image: 'https://i.ibb.co/21CdL4Gy/patanegra-1765760193272.jpg',
    category: ProductCategory.KEG30,
    type: BeerType.LAGER,
    volumeLiters: 30,
    isPopular: true,
    abv: 5.0,
    ibu: 0,
    pairing: 'Carnes assadas, Queijos, Massas, Sobremesas',
  },
  {
    id: 'keg-vinho-tinto-30',
    name: 'Barril Vinho Tinto 30L',
    description: 'Fermentado de uvas Isabel e Bordeaux, com perfil frisante e creme marcante.',
    price: 450,
    image: 'https://i.ibb.co/xqBsYVDJ/patanegra-1765760427371.jpg',
    category: ProductCategory.KEG30,
    type: BeerType.LAGER,
    volumeLiters: 30,
    abv: 5.0,
    ibu: 0,
    pairing: 'Carnes, Queijos, Massas, Sobremesas',
  },
  {
    id: 'keg-session-ipa-30',
    name: 'Barril Session IPA 30L',
    description: 'Cerveja leve, dourada, extremamente refrescante, com amargor moderado e aroma cítrico intenso.',
    price: 480,
    image: 'https://i.ibb.co/gZLtmYQq/patanegra-1765760756583.png',
    category: ProductCategory.KEG30,
    type: BeerType.IPA,
    volumeLiters: 30,
    abv: 5.0,
    ibu: 30,
    pairing: 'Hambúrguer, Comida mexicana, Carne assada, Massas',
  },

  // ============================================================================
  // BARRIS 50L (Prioridade: Pilsen)
  // ============================================================================
  {
    id: 'keg-pilsen-50',
    name: 'Barril Pilsen 50L',
    description: 'A típica Pilsen dos brasileiros. Cerveja clara, leve, refrescante e de baixo amargor.',
    price: 645,
    image: 'https://i.ibb.co/szz3tB3/patanegra-1765760642049.png',
    category: ProductCategory.KEG50,
    type: BeerType.PILSEN,
    volumeLiters: 50,
    isChampion: true, // Campeão de Vendas
    abv: 4.5,
    ibu: 7,
    pairing: 'Churrasco completo e eventos corporativos.',
  },
  {
    id: 'keg-lager-50',
    name: 'Barril Premium Lager 50L',
    description: 'Cerveja dourada com notas maltadas, corpo médio, amargor moderado e espuma cremosa.',
    price: 740, // Marechal (Base)
    image: 'https://i.ibb.co/4w56W9gb/patanegra-1765760786878.png',
    category: ProductCategory.KEG50,
    type: BeerType.LAGER,
    volumeLiters: 50,
    isPopular: true,
    checkAvailability: true, // Tag vermelha obrigatória
    abv: 4.5,
    ibu: 12,
    pairing: 'Churrasco completo, frango a passarinho e pizza margherita.',
  },
];

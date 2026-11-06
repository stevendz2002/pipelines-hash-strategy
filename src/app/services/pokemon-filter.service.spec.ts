import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PokemonFilterService, TypeSummary, FilteredPokemon } from './pokemon-filter.service';

describe('PokemonFilterService', () => {
  let service: PokemonFilterService;
  let httpMock: HttpTestingController;

  const mockTypesResponse: { results: TypeSummary[] } = {
    results: [
      { name: 'normal', url: 'https://pokeapi.co/api/v2/type/1/' },
      { name: 'fighting', url: 'https://pokeapi.co/api/v2/type/2/' },
      { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' }
    ]
  };

  const mockTypeDetailResponse = {
    name: 'electric',
    pokemon: [
      {
        pokemon: {
          name: 'pikachu',
          url: 'https://pokeapi.co/api/v2/pokemon/25/'
        },
        slot: 1
      },
      {
        pokemon: {
          name: 'raichu',
          url: 'https://pokeapi.co/api/v2/pokemon/26'
        },
        slot: 1
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PokemonFilterService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(PokemonFilterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTypes', () => {
    it('should fetch the list of 18 main Pokemon types and map results', () => {
      let result: TypeSummary[] | undefined;

      service.getTypes().subscribe(types => {
        result = types;
      });

      const req = httpMock.expectOne('https://pokeapi.co/api/v2/type?limit=18');
      expect(req.request.method).toBe('GET');

      req.flush(mockTypesResponse);

      expect(result).toEqual(mockTypesResponse.results);
      expect(result?.length).toBe(3);
    });

    it('should return empty array if results is empty', () => {
      let result: TypeSummary[] | undefined;

      service.getTypes().subscribe(types => {
        result = types;
      });

      const req = httpMock.expectOne('https://pokeapi.co/api/v2/type?limit=18');
      req.flush({ results: [] });

      expect(result).toEqual([]);
    });
  });

  describe('getPokemonByType', () => {
    it('should fetch Pokemon of a specific type and map them with artwork URLs', () => {
      let result: FilteredPokemon[] | undefined;

      service.getPokemonByType('electric').subscribe(pokemon => {
        result = pokemon;
      });

      const req = httpMock.expectOne('https://pokeapi.co/api/v2/type/electric');
      expect(req.request.method).toBe('GET');

      req.flush(mockTypeDetailResponse);

      expect(result).toBeDefined();
      expect(result?.length).toBe(2);
      expect(result?.[0]).toEqual({
        name: 'pikachu',
        url: 'https://pokeapi.co/api/v2/pokemon/25/',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
      });
      expect(result?.[1]).toEqual({
        name: 'raichu',
        url: 'https://pokeapi.co/api/v2/pokemon/26',
        artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png'
      });
    });

    it('should handle empty pokemon list correctly', () => {
      let result: FilteredPokemon[] | undefined;

      service.getPokemonByType('unknown').subscribe(pokemon => {
        result = pokemon;
      });

      const req = httpMock.expectOne('https://pokeapi.co/api/v2/type/unknown');
      req.flush({ name: 'unknown', pokemon: [] });

      expect(result).toEqual([]);
    });
  });
});

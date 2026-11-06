import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError, Subject } from 'rxjs';
import { PokemonFilterComponent } from './pokemon-filter.component';
import { PokemonFilterService, TypeSummary, FilteredPokemon } from '../services/pokemon-filter.service';

describe('PokemonFilterComponent', () => {
  let component: PokemonFilterComponent;
  let fixture: ComponentFixture<PokemonFilterComponent>;
  let mockFilterService: jasmine.SpyObj<PokemonFilterService>;

  const mockTypes: TypeSummary[] = [
    { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' },
    { name: 'fire', url: 'https://pokeapi.co/api/v2/type/10/' },
    { name: 'water', url: 'https://pokeapi.co/api/v2/type/11/' }
  ];

  const mockElectricPokemon: FilteredPokemon[] = [
    {
      name: 'pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon/25/',
      artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
    },
    {
      name: 'raichu',
      url: 'https://pokeapi.co/api/v2/pokemon/26/',
      artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/26.png'
    }
  ];

  const mockFirePokemon: FilteredPokemon[] = [
    {
      name: 'charmander',
      url: 'https://pokeapi.co/api/v2/pokemon/4/',
      artworkUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png'
    }
  ];

  beforeEach(async () => {
    mockFilterService = jasmine.createSpyObj('PokemonFilterService', ['getTypes', 'getPokemonByType']);
    mockFilterService.getTypes.and.returnValue(of(mockTypes));
    mockFilterService.getPokemonByType.and.returnValue(of(mockElectricPokemon));

    await TestBed.configureTestingModule({
      imports: [PokemonFilterComponent],
      providers: [
        { provide: PokemonFilterService, useValue: mockFilterService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonFilterComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with "electric" as default selected type', () => {
    expect(component.selectedType).toBe('electric');
  });

  it('should render page heading and instructions', () => {
    fixture.detectChanges();
    const heading = fixture.nativeElement.querySelector('h1');
    expect(heading.textContent).toContain('Filtro por Tipo');
  });

  it('should render type filter buttons from service', () => {
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.filters button');
    expect(buttons.length).toBe(3);
    expect(buttons[0].textContent.trim()).toBe('Electric');
    expect(buttons[1].textContent.trim()).toBe('Fire');
    expect(buttons[2].textContent.trim()).toBe('Water');
  });

  it('should mark the currently selected type button with active class', () => {
    fixture.detectChanges();
    const buttons: HTMLButtonElement[] = fixture.nativeElement.querySelectorAll('.filters button');
    expect(buttons[0].classList.contains('active')).toBeTrue();
    expect(buttons[1].classList.contains('active')).toBeFalse();
  });

  it('should render pokemon cards when state has data', () => {
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('.pokemon-card');
    expect(cards.length).toBe(2);

    const firstCard = cards[0];
    const img = firstCard.querySelector('img');
    const title = firstCard.querySelector('h2');
    const link = firstCard.querySelector('a');

    expect(title.textContent).toBe('Pikachu');
    expect(img.getAttribute('src')).toBe(mockElectricPokemon[0].artworkUrl);
    expect(img.getAttribute('alt')).toBe('pikachu');
    expect(link.getAttribute('href')).toBe(mockElectricPokemon[0].url);
  });

  it('should show loading indicator while waiting for pokemon data', () => {
    const pendingSubject = new Subject<FilteredPokemon[]>();
    mockFilterService.getPokemonByType.and.returnValue(pendingSubject.asObservable());

    const loadingFixture = TestBed.createComponent(PokemonFilterComponent);
    loadingFixture.detectChanges();

    const status = loadingFixture.nativeElement.querySelector('.status');
    expect(status).toBeTruthy();
    expect(status.textContent).toContain('Cargando Pokémon del tipo electric');
    expect(loadingFixture.nativeElement.querySelector('.pokemon-grid')).toBeNull();
  });

  it('should update selectedType and request new pokemon when selectType is called', () => {
    fixture.detectChanges();

    mockFilterService.getPokemonByType.and.returnValue(of(mockFirePokemon));
    component.selectType('fire');
    fixture.detectChanges();

    expect(component.selectedType).toBe('fire');
    expect(mockFilterService.getPokemonByType).toHaveBeenCalledWith('fire');

    const cards = fixture.nativeElement.querySelectorAll('.pokemon-card');
    expect(cards.length).toBe(1);
    expect(cards[0].querySelector('h2').textContent).toBe('Charmander');
  });

  it('should select type when clicking a type button in the UI', () => {
    fixture.detectChanges();

    mockFilterService.getPokemonByType.and.returnValue(of(mockFirePokemon));
    const buttons = fixture.debugElement.queryAll(By.css('.filters button'));
    buttons[1].nativeElement.click();
    fixture.detectChanges();

    expect(component.selectedType).toBe('fire');
    expect(buttons[1].nativeElement.classList.contains('active')).toBeTrue();
    expect(buttons[0].nativeElement.classList.contains('active')).toBeFalse();
  });

  it('should render error message when service throws an error', () => {
    mockFilterService.getPokemonByType.and.returnValue(throwError(() => new Error('API Error')));
    const errFixture = TestBed.createComponent(PokemonFilterComponent);
    errFixture.detectChanges();

    const errorEl = errFixture.nativeElement.querySelector('.error');
    expect(errorEl).toBeTruthy();
    expect(errorEl.textContent).toContain('No se pudo cargar la lista.');
    expect(errFixture.nativeElement.querySelector('.pokemon-grid')).toBeNull();
  });
});

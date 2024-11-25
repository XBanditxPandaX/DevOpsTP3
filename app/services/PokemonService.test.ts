import { describe, it, beforeEach, expect, vi } from "vitest";
import { PokemonService } from "~/services/PokemonService";
import { Pokemon } from "~/services/pokemon";
import { PokeApiClient } from "~/services/PokeApiClient";

vi.mock("~/services/PokeApiClient");

describe("PokemonService", () => {
  let pokemonService: PokemonService;
  let mockPokeApiClient: PokeApiClient;

  const mockPokemonList: Pokemon[] = [
    { id: 1, name: "Kohaku", sprite: "test", types: ["test"] },
    { id: 2, name: "Kiki", sprite: "test", types: ["test"] },
    { id: 3, name: "LaPetiteDinde", sprite: "test", types: ["test"] },
  ];

  beforeEach(() => {
    mockPokeApiClient = new PokeApiClient() as PokeApiClient;
    mockPokeApiClient.getPokemonList = vi.fn().mockResolvedValue(mockPokemonList);
    pokemonService = new PokemonService(mockPokeApiClient);
  });

  describe("getPokemonList", () => {
    it("should fetch and return the list of Pokémon from the API client", async () => {
      const pokemonList = await pokemonService.getPokemonList();
      expect(mockPokeApiClient.getPokemonList).toHaveBeenCalledTimes(1);
      expect(pokemonList).toEqual(mockPokemonList);
    });
  });

  describe("getUserTeam", () => {
    it("should return an empty team if the user has no team", () => {
      const team = pokemonService.getUserTeam("user1");
      expect(team).toEqual([]);
    });

    it("should return the team for a specific user", () => {
      const userId = "user1";
      const team: Pokemon[] = [{ id: 4, name: "Vi", sprite: "test", types: ["test"] }];
      pokemonService.togglePokemonInTeam(userId, team[0]);

      const userTeam = pokemonService.getUserTeam(userId);
      expect(userTeam).toEqual(team);
    });
  });

  describe("clearTeam", () => {
    it("should clear the user's team", () => {
      const userId = "user1";
      const pokemon: Pokemon = { id: 4, name: "Vi", sprite: "test", types: ["test"] };
      pokemonService.togglePokemonInTeam(userId, pokemon);

      pokemonService.clearTeam(userId);
      expect(pokemonService.getUserTeam(userId)).toEqual([]);
    });
  });

  describe("togglePokemonInTeam", () => {
    const userId = "user1";
    const pokemon: Pokemon = { id: 5, name: "Jayce", sprite: "test", types: ["test"] };

    it("should add a Pokémon to the team if not already present", () => {
      const result = pokemonService.togglePokemonInTeam(userId, pokemon);
      expect(result).toBe(true);
      expect(pokemonService.getUserTeam(userId)).toEqual([pokemon]);
    });

    it("should remove a Pokémon from the team if already present", () => {
      pokemonService.togglePokemonInTeam(userId, pokemon);

      const result = pokemonService.togglePokemonInTeam(userId, pokemon);
      expect(result).toBe(true);
      expect(pokemonService.getUserTeam(userId)).toEqual([]);
    });

    it("should not add more than 6 Pokémon to the team", () => {
      const team = [
        { id: 1, name: "Kohaku", sprite: "test", types: ["test"] },
        { id: 2, name: "Kiki", sprite: "test", types: ["test"] },
        { id: 3, name: "LaPetiteDinde", sprite: "test", types: ["test"] },
        { id: 4, name: "Vi", sprite: "test", types: ["test"] },
        { id: 5, name: "Jinx", sprite: "test", types: ["test"] },
        { id: 6, name: "Victor", sprite: "test", types: ["test"] },
      ];

      team.forEach((poke) => pokemonService.togglePokemonInTeam(userId, poke));

      const newPokemon: Pokemon = { id: 7, name: "BurkCaitlyn", sprite: "test", types: ["test"] };
      const result = pokemonService.togglePokemonInTeam(userId, newPokemon);
      expect(result).toBe(false);
      expect(pokemonService.getUserTeam(userId)).toEqual(team);
    });
  });
});

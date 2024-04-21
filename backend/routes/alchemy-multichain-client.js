const { Alchemy, Network } = require('alchemy-sdk')

AlchemyMultichainClient = class AlchemyMultichainClient {
    /**
     * @param {AlchemyMultichainSettings} settings The settings to use for all networks.
     * @param {Partial<Record<Network, AlchemyMultichainSettings>>} overrides Optional settings to use for specific networks.
     */
    constructor(settings, overrides) {
      this.settings = settings;
      this.overrides = overrides;
      this.instances = new Map();
    }
  
    /**
     * Returns an instance of `Alchemy` for the given `Network`.
     *
     * @param {Network} network
     * @returns {Alchemy}
     */
    forNetwork(network) {
      return this.loadInstance(network);
    }
  
    /**
     * Checks if an instance of `Alchemy` exists for the given `Network`. If not,
     * it creates one and stores it in the `instances` map.
     *
     * @private
     * @param {Network} network
     * @returns {Alchemy}
     */
    loadInstance(network) {
      if (!this.instances.has(network)) {
        // Use overrides if they exist -- otherwise use the default settings.
        const alchemySettings =
          this.overrides && this.overrides[network]
            ? { ...this.overrides[network], network }
            : { ...this.settings, network };
        this.instances.set(network, new Alchemy(alchemySettings));
      }
      return this.instances.get(network);
    }
  }
  
  /** AlchemySettings with the `network` param omitted in order to avoid confusion. */
  class AlchemyMultichainSettings {};
  
  module.exports = { AlchemyMultichainClient, AlchemyMultichainSettings };
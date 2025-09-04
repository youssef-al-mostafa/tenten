<x-filament-panels::page>
    @php
        $vendorData = $this->getVendorData();
    @endphp

    @if($vendorData)
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 space-y-6">
                <x-filament::section>
                    <x-slot name="heading">
                        <div class="flex items-center space-x-4">
                            <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                                <x-filament::icon icon="heroicon-o-user-circle" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div>
                                <h2 class="text-xl font-bold text-gray-950 dark:text-white">{{ $vendorData['name'] }}</h2>
                                <p class="text-sm text-gray-500 dark:text-gray-400">{{ $vendorData['store_name'] }}</p>
                            </div>
                        </div>
                    </x-slot>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</label>
                                <p class="text-sm text-gray-950 dark:text-white">{{ $vendorData['email'] }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Phone</label>
                                <p class="text-sm text-gray-950 dark:text-white">{{ $vendorData['phone'] }}</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Address</label>
                                <p class="text-sm text-gray-950 dark:text-white">{{ $vendorData['address'] }}</p>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Store Description</label>
                            <p class="text-sm text-gray-950 dark:text-white">{{ $vendorData['store_description'] }}</p>
                        </div>
                    </div>
                </x-filament::section>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <x-filament::section class="text-center">
                        <div class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">{{ $vendorData['products_count'] }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">Total Products</div>
                    </x-filament::section>
                    
                    <x-filament::section class="text-center">
                        <div class="text-3xl font-bold text-success-600 dark:text-success-400 mb-2">{{ $vendorData['active_products_count'] }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">Published Products</div>
                    </x-filament::section>
                    
                    <x-filament::section class="text-center">
                        <div class="text-3xl font-bold text-warning-600 dark:text-warning-400 mb-2">{{ $vendorData['member_since'] }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">Member Since</div>
                    </x-filament::section>
                </div>
            </div>

            <x-filament::section>
                <x-slot name="heading">
                    <div class="flex items-center space-x-2">
                        <x-filament::icon icon="heroicon-o-share" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <span>Share Your Store</span>
                    </div>
                </x-slot>
                
                <div class="space-y-4">
                    <button 
                        onclick="showQrModal()" 
                        class="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                        <x-filament::icon icon="heroicon-o-qr-code" class="w-5 h-5" />
                        <span>Show QR Code</span>
                    </button>

                    <div class="relative">
                        <input 
                            type="text" 
                            value="{{ $vendorUrl }}" 
                            readonly 
                            id="vendorUrl"
                            class="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-sm text-gray-950 dark:text-white pr-12 focus:ring-primary-500 focus:border-primary-500"
                        >
                        <button 
                            onclick="copyToClipboard()" 
                            class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors rounded"
                            title="Copy to clipboard"
                        >
                            <x-filament::icon icon="heroicon-o-clipboard" class="w-4 h-4" />
                        </button>
                    </div>

                    <a 
                        href="{{ $qrCodeUrl }}" 
                        download="qr-code.png"
                        class="w-full bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                        <x-filament::icon icon="heroicon-o-arrow-down-tray" class="w-5 h-5" />
                        <span>Download QR Code</span>
                    </a>
                </div>
            </x-filament::section>
        </div>

        <div id="qrModal" class="fixed inset-0 bg-gray-950/50 dark:bg-gray-950/75 hidden z-50 flex items-center justify-center p-4" x-data>
            <x-filament::section class="max-w-md w-full">
                <x-slot name="heading">
                    <div class="flex justify-between items-center">
                        <span>Your Store QR Code</span>
                        <button 
                            onclick="hideQrModal()" 
                            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                            <x-filament::icon icon="heroicon-o-x-mark" class="w-5 h-5" />
                        </button>
                    </div>
                </x-slot>
                
                <div class="text-center space-y-4">
                    <img src="{{ $qrCodeUrl }}" alt="QR Code" class="mx-auto rounded-lg shadow-sm">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Scan this QR code to visit your store</p>
                    
                    <a 
                        href="{{ $qrCodeUrl }}" 
                        download="qr-code.png"
                        class="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        <x-filament::icon icon="heroicon-o-arrow-down-tray" class="w-4 h-4" />
                        <span>Download QR Code</span>
                    </a>
                </div>
            </x-filament::section>
        </div>

        <script>
            function showQrModal() {
                document.getElementById('qrModal').classList.remove('hidden');
            }

            function hideQrModal() {
                document.getElementById('qrModal').classList.add('hidden');
            }

            function copyToClipboard() {
                const urlInput = document.getElementById('vendorUrl');
                urlInput.select();
                urlInput.setSelectionRange(0, 99999);
                
                navigator.clipboard.writeText(urlInput.value).then(function() {
                    @this.call('copyUrl');
                }).catch(function(err) {
                    console.error('Could not copy text: ', err);
                    document.execCommand('copy');
                    @this.call('copyUrl');
                });
            }

            document.getElementById('qrModal').addEventListener('click', function(e) {
                if (e.target === this) {
                    hideQrModal();
                }
            });
        </script>
    @else
        {{-- Default dashboard for non-vendor users --}}
        <x-filament-widgets::widgets :widgets="$this->getVisibleWidgets()" :columns="$this->getColumns()" />
    @endif
</x-filament-panels::page>
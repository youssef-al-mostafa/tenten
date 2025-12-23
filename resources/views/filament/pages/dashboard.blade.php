<x-filament-panels::page>
    @php
        $vendorData = $this->getVendorData();
    @endphp

    @if ($vendorData)
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 space-y-6">
                <x-filament::section>
                    <x-slot name="heading">
                        <div class="flex items-center justify-between">
                            <div class="flex gap-6 items-center space-x-4">
                                <div
                                    class="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center
                                           justify-center overflow-hidden">
                                    @if ($vendorData['cover_image'])
                                        <img src="{{ asset('storage/' . $vendorData['cover_image']) }}" alt="Store Cover"
                                            class="w-full h-full object-cover">
                                    @else
                                        <x-filament::icon icon="heroicon-o-user-circle"
                                            class="w-10 h-10 text-primary-600 dark:text-primary-400" />
                                    @endif
                                </div>
                                <div>
                                    <h2 class="text-xl font-bold text-gray-950 dark:text-white">
                                        {{ $vendorData['name'] }}</h2>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ $vendorData['store_name'] }}
                                    </p>
                                </div>
                            </div>
                            @if (!$isEditing)
                                <button wire:click="edit"
                                    class="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500
                                           dark:hover:bg-primary-600 text-white font-medium py-2
                                           px-4 rounded-lg transition-colors flex items-center
                                           space-x-2 gap-4">
                                    <x-filament::icon icon="heroicon-o-pencil" class="w-4 h-4" />
                                    <span>Edit Profile</span>
                                </button>
                            @endif
                        </div>
                    </x-slot>

                    @if ($isEditing)
                        <form wire:submit="save">
                            {{ $this->form }}

                            <div class="flex gap-6 space-x-3 mt-6">
                                <button type="submit"
                                    class="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white
                                           font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2">
                                    <x-filament::icon icon="heroicon-o-check" class="w-4 h-4" />
                                    <span>Save Changes</span>
                                </button>

                                <button type="button" wire:click="cancelEdit"
                                    class="bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white
                                           font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2">
                                    <x-filament::icon icon="heroicon-o-x-mark" class="w-4 h-4" />
                                    <span>Cancel</span>
                                </button>
                            </div>
                        </form>
                    @else
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="space-y-4">
                                <div>
                                    <label
                                        class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email</label>
                                    <p class="text-sm text-gray-950 dark:text-white">{{ $vendorData['email'] }}</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Store
                                        Address</label>
                                    <p class="text-sm text-gray-950 dark:text-white">{{ $vendorData['store_address'] }}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Store
                                    Description</label>
                                <p class="text-sm text-gray-950 dark:text-white">{{ $vendorData['store_description'] }}
                                </p>
                            </div>
                        </div>
                    @endif
                </x-filament::section>

                @if (!$isEditing)
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <x-filament::section class="text-center">
                            <div class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                                {{ $vendorData['products_count'] }}</div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">Total Products</div>
                        </x-filament::section>

                        <x-filament::section class="text-center">
                            <div class="text-3xl font-bold text-success-600 dark:text-success-400 mb-2">
                                {{ $vendorData['active_products_count'] }}</div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">Published Products</div>
                        </x-filament::section>

                        <x-filament::section class="text-center">
                            <div class="text-3xl font-bold text-warning-600 dark:text-warning-400 mb-2">
                                {{ $vendorData['member_since'] }}</div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">Member Since</div>
                        </x-filament::section>
                    </div>
                @endif
            </div>

            @if (!$isEditing)
                <x-filament::section>
                    <x-slot name="heading">
                        <div class="flex gap-4 items-center space-x-2">
                            <x-filament::icon icon="heroicon-o-share"
                                class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            <span>Share Your Store</span>
                        </div>
                    </x-slot>

                    <div class="flex gap-6 items-stretch justify-start">
                        <button onclick="showQrModal()"
                            class="w-1/2 bg-primary-600 hover:bg-primary-700
                                   dark:bg-primary-500 dark:hover:bg-primary-600 text-white
                                   font-medium px-4 rounded-lg transition-colors flex
                                   items-center justify-center space-x-2 h-12 gap-4">
                            <x-filament::icon icon="heroicon-o-qr-code" class="w-5 h-5" />
                            <span>Show QR Code</span>
                        </button>

                        <div class="relative w-1/2">
                            <input type="text" value="{{ $vendorUrl }}" readonly id="vendorUrl"
                                class="w-[calc(100% - 28px)] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600
                                          rounded-lg px-4 text-sm text-gray-950 dark:text-white pr-12 focus:ring-primary-500
                                          focus:border-primary-500 h-12">
                            <button onclick="copyToClipboard()"
                                class="absolute right-[-4px] top-1/2 transform -translate-y-1/2 p-1.5 text-gray-500
                                           hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300
                                           transition-colors rounded"
                                title="Copy to clipboard" id="copyButton">
                                <x-filament::icon icon="heroicon-o-clipboard" class="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </x-filament::section>
            @endif
        </div>

        <div id="qrModal"
            class="fixed inset-0 bg-gray-950/50 dark:bg-gray-950/75 hidden z-50 items-center justify-center p-4" x-data>
            <x-filament::section class="max-w-md w-full">
                <x-slot name="heading">
                    <div class="flex justify-between items-center">
                        <span>Your Store QR Code</span>
                        <button onclick="hideQrModal()"
                            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                            <x-filament::icon icon="heroicon-o-x-mark" class="w-5 h-5" />
                        </button>
                    </div>
                </x-slot>

                <div class="text-center space-y-4">
                    <img src="{!! $qrCodeUrl !!}" alt="QR Code" class="mx-auto rounded-lg shadow-sm">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Scan this QR code to visit your store</p>

                    <button onclick="downloadQrCode()"
                        class="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700
                               dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-medium
                               py-2 px-4 rounded-lg transition-colors">
                        <x-filament::icon icon="heroicon-o-arrow-down-tray" class="w-4 h-4" />
                        <span>Download QR Code</span>
                    </button>
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
                const copyButton = document.getElementById('copyButton');

                urlInput.select();
                urlInput.setSelectionRange(0, 99999);

                navigator.clipboard.writeText(urlInput.value).then(function() {
                    copyButton.innerHTML =
                        '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
                    copyButton.className =
                        'absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-green-500 transition-colors rounded';

                    setTimeout(function() {
                        copyButton.innerHTML =
                            '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>';
                        copyButton.className =
                            'absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors rounded';
                    }, 2000);

                    @this.call('copyUrl');
                }).catch(function(err) {
                    console.error('Could not copy text: ', err);
                    document.execCommand('copy');
                    @this.call('copyUrl');
                });
            }

            async function downloadQrCode() {
                try {
                    const response = await fetch('{!! $qrCodeUrl !!}');
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'store-qr-code.png';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                } catch (error) {
                    window.open('{!! $qrCodeUrl !!}', '_blank');
                }
            }

            document.getElementById('qrModal').addEventListener('click', function(e) {
                if (e.target === this) {
                    hideQrModal();
                }
            });
        </script>
    @else
        <x-filament-widgets::widgets :widgets="$this->getVisibleWidgets()" :columns="$this->getColumns()" />
    @endif
</x-filament-panels::page>

$(function () {
    'use strict'

    // Variáveis.
    let URL = window.URL || window.webkitURL
    let image = $('#image')
    let options = {
    }
    let inputImage = $('#inputImage')
    let uploadedImageURL
    let imgData
    let scaleX = 1
    let scaleY = 1

    // Cropper Obj.
    image.cropper(options)

    // Teclado.
    $(document.body).on('keydown', function (e) {
        if(e.target !== this || !image.data('cropper') || this.scrollTop > 300) {
            return
        }

        switch(e.which) {
            case 37:
                e.preventDefault()
                image.cropper('move', -1, 0)
                break
            case 38:
                e.preventDefault()
                image.cropper('move', 0, -1)
                break
            case 39:
                e.preventDefault()
                image.cropper('move', 1, 0)
                break
            case 40:
                e.preventDefault()
                image.cropper('move', 0, 1)
                break
        }
    })

    // Importar imagem.
    if(URL) {
        inputImage.change(function () {
        var files = this.files
        var file

        if(!image.data('cropper')) {
            return
        }

        if(files && files.length) {
            file = files[0]

            if(/^image\/\w+$/.test(file.type)) {

                if(uploadedImageURL) {
                    URL.revokeObjectURL(uploadedImageURL)
                }

                uploadedImageURL = URL.createObjectURL(file)
                image.cropper('destroy').attr('src', uploadedImageURL).cropper(options)
                inputImage.val('')
            } else {
                window.alert('Por favor, selecione uma imagem.')
            }
        }
        })
    } else {
        inputImage.prop('disabled', true).parent().addClass('disabled')
    }

    // Resetar.
    $('#btnResetar').click(function() {
        image.cropper('reset')
    })

    // Mover 1/2.
    $('#btnMover').click(function() {
        image.cropper('setDragMode', 'move')
    })

    // Cortar.
    $('#btnCortar').click(function() {
        image.cropper('setDragMode', 'crop')
    })

    // Mover 2/2.
    $('#btnME').click(function() {
        image.cropper('move', -1, 0)
    })
    $('#btnMD').click(function() {
        image.cropper('move', 1, 0)
    })
    $('#btnMC').click(function() {
        image.cropper('move', 0, -1)
    })
    $('#btnMB').click(function() {
        image.cropper('move', 0, 1)
    })

    // Rotacionar.
    $('#btnRE').click(function() {
        image.cropper('rotate', -1)
    })
    $('#btnRD').click(function() {
        image.cropper('rotate', 1)
    })

    // Inverter.
    $('#btnIH').click(function() {
        scaleX *= -1
        image.cropper('scaleX', scaleX)
    })
    $('#btnIV').click(function() {
        scaleY *= -1
        image.cropper('scaleY', scaleY)
    })

    // Limpar.
    $('#btnLimpar').click(function() {
        image.cropper('clear')
    })

    // Gerar.
    $('#btnGerar').click(function() {
        image.cropper('crop')
        getCropped()
    })

    // Cadeado.
    $('#btnTravar').click(function() {
        image.cropper('disable')
        $(this).toggleClass('active')
        $('#btnDestr').removeClass('active')
    })
    $('#btnDestr').click(function() {
        image.cropper('enable')
        $(this).toggleClass('active')
        $('#btnTravar').removeClass('active')
    })

    // Pegar Cropped.
    function getCropped() {
        let canvas = image.cropper('getCroppedCanvas', {
            imageSmoothingEnabled: false,
            imageSmoothingQuality: 'high'
        })

        $('#boxReferencia').hide()
        if(canvas) {
            $('#boxReferencia').show()
            gerarReferencia(canvas)
        }
    }

    // Gerar Referência: criar tabela com cada célula sendo um pixel e converte-a em imagem.
    function gerarReferencia(canvas) {
        let context = canvas.getContext('2d')
        imgData = context.getImageData(0, 0, canvas.width, canvas.height)
        let d = imgData.data

        let result = document.querySelector('#resultado')
        let resultTable = result.querySelector('table')
        if(resultTable) {
            resultTable.remove()
        }

        let table = document.createElement('table')
        table.cellPadding = 0
        table.cellSpacing = 0
        table.id = "ref"

        for(let y=0; y<imgData.height; y++) {
            let tr = document.createElement('tr')
            for(let x=0; x<imgData.width; x++) {
                let td = document.createElement('td')

                let i = (y * imgData.width + x) * 4
                td.style.backgroundColor = 'rgba('+ [d[i], d[i+1], d[i+2], d[i+3]].join(',') +')'

                tr.appendChild(td)
            }
            table.appendChild(tr)
        }
        result.appendChild(table)
        redimensionarPixels()

        let posScroll = $('#boxReferencia').offset().top    // Rolar para o resultado.
        $('html, body').animate({scrollTop: posScroll})
    }

    // Redimensionar os pixels da Referência.
    $(window).resize(redimensionarPixels)
    function redimensionarPixels() {
        let resultWidth = $('#resultado').width()
        let pixelDim = resultWidth / imgData.width

        $('#ref td').width(pixelDim).height(pixelDim)
    }
})